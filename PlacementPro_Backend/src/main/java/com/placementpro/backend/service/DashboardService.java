package com.placementpro.backend.service;

import com.placementpro.backend.dto.*;
import com.placementpro.backend.entity.*;
import com.placementpro.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ModelMapper modelMapper;

    /**
     * Health check endpoint
     */
    public String healthCheck() {
        log.info("HEALTH_CHECK");
        return "Dashboard OK";
    }

    /**
     * Get admin dashboard statistics
     */
    public AdminDashboardDTO getAdminDashboard() {
        log.info("ADMIN_DASHBOARD_REQUEST");

        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        AdminDashboardDTO dto = AdminDashboardDTO.builder()
                .totalStudents(totalUsers / 3)
                .totalEmployers(totalUsers / 3)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .recentActivities(java.util.List.of())
                .build();

        log.info("ADMIN_DASHBOARD_SUCCESS users={} jobs={} applications={}",
                totalUsers, totalJobs, totalApplications);

        return dto;
    }

    /**
     * Get placement officer dashboard statistics
     */
    public OfficerDashboardDTO getPlacementOfficerDashboard() {
        log.info("PLACEMENT_OFFICER_DASHBOARD_REQUEST");

        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        OfficerDashboardDTO dto = OfficerDashboardDTO.builder()
                .totalStudents(userRepository.count() / 3)
                .totalCompanies(userRepository.count() / 3)
                .activeJobs(totalJobs)
                .placedStudents(0)
                .pendingApplications(totalApplications)
                .build();

        log.info("PLACEMENT_OFFICER_DASHBOARD_SUCCESS jobs={} applications={}",
                totalJobs, totalApplications);

        return dto;
    }
}
