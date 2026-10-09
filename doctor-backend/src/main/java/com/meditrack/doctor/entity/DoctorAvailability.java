package com.meditrack.doctor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor_availabilities")
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek; // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "start_time", nullable = false, length = 10)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 10)
    private String endTime;

    @Column(name = "break_start_time", length = 10)
    private String breakStartTime;

    @Column(name = "break_end_time", length = 10)
    private String breakEndTime;

    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes = 30;

    public DoctorAvailability() {}

    public DoctorAvailability(Long id, Long doctorId, String dayOfWeek, Boolean isAvailable, String startTime, String endTime, String breakStartTime, String breakEndTime, Integer slotDurationMinutes) {
        this.id = id;
        this.doctorId = doctorId;
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

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

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
