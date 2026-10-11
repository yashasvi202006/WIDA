package com.meditrack.doctor.dto;

import java.util.List;

public class DoctorAvailabilityDto {

    private Long doctorId;
    private List<DayScheduleDto> weeklySchedule;

    public DoctorAvailabilityDto() {}

    public DoctorAvailabilityDto(Long doctorId, List<DayScheduleDto> weeklySchedule) {
        this.doctorId = doctorId;
        this.weeklySchedule = weeklySchedule;
    }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public List<DayScheduleDto> getWeeklySchedule() { return weeklySchedule; }
    public void setWeeklySchedule(List<DayScheduleDto> weeklySchedule) { this.weeklySchedule = weeklySchedule; }

    public static class DayScheduleDto {
        private Long id;
        private String dayOfWeek;
        private Boolean isAvailable;
        private String startTime;
        private String endTime;
        private String breakStartTime;
        private String breakEndTime;
        private Integer slotDurationMinutes;

        public DayScheduleDto() {}

        public DayScheduleDto(Long id, String dayOfWeek, Boolean isAvailable, String startTime, String endTime, String breakStartTime, String breakEndTime, Integer slotDurationMinutes) {
            this.id = id;
            this.dayOfWeek = dayOfWeek;
            this.isAvailable = isAvailable;
            this.startTime = startTime;
            this.endTime = endTime;
            this.breakStartTime = breakStartTime;
            this.breakEndTime = breakEndTime;
            this.slotDurationMinutes = slotDurationMinutes;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

        public Boolean getIsAvailable() { return isAvailable; }
        public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

        public String getStartTime() { return startTime; }
        public void setStartTime(String startTime) { this.startTime = startTime; }

        public String getEndTime() { return endTime; }
        public void setEndTime(String endTime) { this.endTime = endTime; }

        public String getBreakStartTime() { return breakStartTime; }
        public void setBreakStartTime(String breakStartTime) { this.breakStartTime = breakStartTime; }

        public String getBreakEndTime() { return breakEndTime; }
        public void setBreakEndTime(String breakEndTime) { this.breakEndTime = breakEndTime; }

        public Integer getSlotDurationMinutes() { return slotDurationMinutes; }
        public void setSlotDurationMinutes(Integer slotDurationMinutes) { this.slotDurationMinutes = slotDurationMinutes; }
    }
}
