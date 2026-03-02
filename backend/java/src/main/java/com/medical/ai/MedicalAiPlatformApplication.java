package com.medical.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 医学影像AI集成平台主启动类
 * 
 * @author Medical AI Team
 * @version 2.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class MedicalAiPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalAiPlatformApplication.class, args);
    }
}
