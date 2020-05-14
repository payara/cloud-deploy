/*
 * Copyright (c) 2020 Payara Foundation and/or its affiliates. All rights reserved.
 *
 *  The contents of this file are subject to the terms of either the GNU
 *  General Public License Version 2 only ("GPL") or the Common Development
 *  and Distribution License("CDDL") (collectively, the "License").  You
 *  may not use this file except in compliance with the License.  You can
 *  obtain a copy of the License at
 *  https://github.com/payara/Payara/blob/master/LICENSE.txt
 *  See the License for the specific
 *  language governing permissions and limitations under the License.
 *
 *  When distributing the software, include this License Header Notice in each
 *  file and include the License file at glassfish/legal/LICENSE.txt.
 *
 *  GPL Classpath Exception:
 *  The Payara Foundation designates this particular file as subject to the "Classpath"
 *  exception as provided by the Payara Foundation in the GPL Version 2 section of the License
 *  file that accompanied this code.
 *
 *  Modifications:
 *  If applicable, add the following below the License Header, with the fields
 *  enclosed by brackets [] replaced by your own identifying information:
 *  "Portions Copyright [year] [name of copyright owner]"
 *
 *  Contributor(s):
 *  If you wish your version of this file to be governed by only the CDDL or
 *  only the GPL Version 2, indicate your decision by adding "[Contributor]
 *  elects to include this software in this distribution under the [CDDL or GPL
 *  Version 2] license."  If you don't indicate a single choice of license, a
 *  recipient has the option to distribute your version of this file under
 *  either the CDDL, the GPL Version 2 or to extend the choice of license to
 *  its licensees as provided above.  However, if you add GPL Version 2 code
 *  and therefore, elected the GPL Version 2 license, then the option applies
 *  only if the new code is made subject to such option by the copyright
 *  holder.
 */

package fish.payara.cloud.instance.applicator;

import fish.payara.cloud.instance.Applicator;
import fish.payara.micro.PayaraMicro;
import fish.payara.micro.PayaraMicroRuntime;
import fish.payara.micro.boot.AdminCommandRunner;
import fish.payara.micro.boot.PayaraMicroBoot;

import javax.management.AttributeList;
import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.CodeSource;
import java.security.ProtectionDomain;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

public class APIApplicator implements Applicator {
    private final Supplier<PayaraMicroBoot> bootStrap;
    private PayaraMicroBoot instance;
    private List<Command> preBootCommands = new ArrayList<>();
    private List<Command> postBootCommands = new ArrayList<>();
    private List<Command> postDeployCommands = new ArrayList<>();
    private List<Deployment> deployments = new ArrayList<>();
    private PayaraMicroRuntime runtime;

    public APIApplicator(Supplier<PayaraMicroBoot> apiBootstrap) {
        this.bootStrap = apiBootstrap;
    }

    @Override
    public void addPreBootCommand(String command, String... arguments) {
        preBootCommands.add(new Command(command, arguments));
    }

    @Override
    public void addPostBootCommand(String command, String... arguments) {
        postBootCommands.add(new Command(command, arguments));
    }

    @Override
    public void addPostDeployCommand(String command, String... arguments) {
        postDeployCommands.add(new Command(command, arguments));
    }

    @Override
    public void addDeployment(String artifact, String contextPath) {
        deployments.add(new Deployment(artifact, contextPath));
    }

    @Override
    public void addSystemProperty(String name, String value) {
        // instance system properties are mine system properties
        System.setProperty(name, value);
    }

    @Override
    public PayaraMicroBoot start() throws Exception {
        this.instance = bootStrap.get();
        instance.setPreBootHandler(this::applyPrebootCommands);
        instance.setPostBootHandler(this::applyPostBootCommands);
        runtime = instance.bootStrap();
        deployments.forEach(d -> d.register(runtime));
        return instance;
    }

    private void applyPostBootCommands(AdminCommandRunner adminCommandRunner) {
        postBootCommands.forEach(c -> c.apply(adminCommandRunner));
    }

    private void applyPrebootCommands(AdminCommandRunner adminCommandRunner) {
        preBootCommands.forEach(c -> c.apply(adminCommandRunner));
    }

    @Override
    public PayaraMicroBoot getServer() {
        return instance;
    }


    static final String BOOT_JAR_URL = "fish.payara.micro.BootJar";
    static final String ROOT_DIR_PATH = "fish.payara.micro.UnpackDir";
    public static PayaraMicroBoot bootFromFlatClasspath() {
        File bootJar = determineBootJar();
        try {
            var instance = createMicroBoot(bootJar);
            instance.setRootDir(bootJar.getParentFile());
            System.setProperty(ROOT_DIR_PATH, instance.getRootDir().getAbsolutePath());
            return instance;
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Cannot instantiate Payara Micro",e);
        }
    }

    private static PayaraMicroBoot createMicroBoot(File bootJar) throws ReflectiveOperationException {
        // PayaraMicro API doesn't recognize embedded launch yet, so we still need to help it here.
        // generally we likely need more expressive API than PayaraMicro.getInstance()
        // or just reckognizing when impl is on classpath, just use it directly
        System.setProperty(BOOT_JAR_URL, bootJar.toURI().toString());
        Class<?> impl = APIApplicator.class.getClassLoader().loadClass("fish.payara.micro.impl.PayaraMicroImpl");
        Method instanceMethod = impl.getDeclaredMethod("getInstance");
        return (PayaraMicroBoot) instanceMethod.invoke(null);
    }

    private static File determineBootJar() {
        ProtectionDomain protectionDomain = PayaraMicro.class.getProtectionDomain();
        CodeSource codeSource = protectionDomain.getCodeSource();
        if (codeSource != null) {
            try {
                URI sourceUri = codeSource.getLocation().toURI();
                return new File(sourceUri);
            } catch (RuntimeException | URISyntaxException e) {
                throw new IllegalStateException("Could not determine location of launcher jar", e);
            }
        } else {
            throw new IllegalStateException("Could not determine location of launcher.jar");
        }
    }

    private class Command {
        private final String command;
        private final String[] arguments;

        public Command(String command, String[] arguments) {
            this.command = command;
            this.arguments = arguments;
        }

        void apply(AdminCommandRunner runner) {
            runner.run(command, arguments);
        }
    }

    private class Deployment {
        private final String artifact;
        private final String contextPath;

        public Deployment(String artifact, String contextPath) {
            this.artifact = artifact;
            this.contextPath = contextPath;
        }

        void register(PayaraMicroRuntime runtime) {
            var f = new File(artifact);
            var name = f.getName().replaceFirst("\\.\\w+$", "");
            runtime.deploy(name, contextPath, f);
        }
    }
}
