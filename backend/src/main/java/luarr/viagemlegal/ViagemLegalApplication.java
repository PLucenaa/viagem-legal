package luarr.viagemlegal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ViagemLegalApplication {

    public static void main(String[] args) {
        SpringApplication.run(ViagemLegalApplication.class, args);
    }

}
