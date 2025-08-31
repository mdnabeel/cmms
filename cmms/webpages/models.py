from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Create your models here.

#--------------------------------
# User & Team Management
#--------------------------------

class User(AbstractUser):
    RoleChoices = [
        ('admin', 'Admin'),
        ('team_manager', 'team_Manager'),
        ('equipment_manager', 'Equipment_Manager'),
        ('spare_manager', 'Spare_Manager'),
        ('technician', 'Technician'),
        ('operator', 'Operator'),
        ('viewer', 'Viewer'),
    ]
    role = models.CharField(max_length=30, choices=RoleChoices, default='viewer')

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='teams')

    def __str__(self):
        return self.name
    


#--------------------------------
# Equipment Management
#--------------------------------

class Equipment(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('under_maintenance', 'Under Maintenance'),
        ('decommissioned', 'Decommissioned'),
    ]

    name=models.CharField(max_length=100)
    equipment_type=models.CharField(max_length=100, blank=True, null=True)
    seril_number=models.CharField(max_length=100, unique=True)
    location=models.CharField(max_length=100)
    install_date=models.DateField(default=timezone.now)
    status=models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.name} ({self.seril_number}) - {self.status} : {self.location}"
    

#--------------------------------
# Spares & Inventory Management
#--------------------------------

class SparePart(models.Model):
    name=models.CharField(max_length=100)
    code=models.CharField(max_length=100, unique=True)
    make=models.CharField(max_length=100, blank=True, null=True)
    model=models.CharField(max_length=100, blank=True, null=True)
    description=models.TextField(blank=True, null=True)
    stock_quantity=models.PositiveIntegerField(default=0)
    location=models.CharField(max_length=100)
    reorder_level=models.PositiveIntegerField(default=5)

    def __str__(self):
        return f"{self.name} ({self.code}): ({self.description}) - Stock: {self.stock_quantity}"
    
class SpareTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('issue', 'Issue'),
        ('receive', 'Receive'),
        ('transfer', 'Transfer'),
    ]
    spare=models.ForeignKey(SparePart, on_delete=models.CASCADE, related_name='transactions')
    quantity=models.PositiveIntegerField()
    transaction_type=models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    requested_by=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='spare_requests')
    approved_by=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='spare_approvals')
    timestamp=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.spare.name} - Qty: {self.quantity} on {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
    

class PurchaseRequest(models.Model):
    spare=models.ForeignKey(SparePart, on_delete=models.CASCADE)
    quantity=models.PositiveIntegerField()
    status=models.CharField(max_length=20, choices=[('pending', 'Pending'),
                                                     ('approved', 'Approved'), ('ordered', 'Ordered'), 
                                                     ('received', 'Received')], default='pending')
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PR-{self.id} for {self.spare.name} ({self.quantity})"
    


#--------------------------------
# Maintenance & Work Order Management
#--------------------------------

class MaintenanceSchedule(models.Model):
    MAINTENANCE_TYPES = [
        ('preventive', 'Preventive'),
        ('corrective', 'Corrective'),
        ('predictive', 'Predictive'),
    ]

    equipment=models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='schedules')
    schedule_type=models.CharField(max_length=20, choices=MAINTENANCE_TYPES)
    frequency_days=models.PositiveIntegerField(null=True, blank=True)
    run_hours=models.PositiveIntegerField(null=True, blank=True)
    next_due_date=models.DateField()

    def __str__(self):
        return f"{self.equipment.name} - {self.schedule_type} due on {self.next_due_date}"
    

class WorkOrder(models.Model):
    STATUS_CHOICES = [
        ('pending','Pending'),
        ('assigned','Assigned'),
        ('approved','Approved'),
        ('in_progress','In Progress'),
        ('completed','Completed'),
        ('closed','Closed'),
    ]
    PRIORITY_CHOICES = [
        ('low','Low'),
        ('medium','Medium'),
        ('high','High'),
        ('critical','Critical'),
    ]

    number=models.CharField(max_length=20, unique=True)
    equipment=models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='work_orders')
    created_by=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_work_orders')
    assigned_team=models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_work_orders')
    description=models.TextField()
    status=models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority=models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"WO-{self.number} for {self.equipment.name} - {self.status}"
    


#--------------------------------
# Reports & Analytics
#--------------------------------

class PerformanceReport(models.Model):
    Report_Types = [
        ('oee', 'OEE'),
        ('availability', 'Availability'),
        ('reliability', 'Reliability'),
        ('shutdown', 'Shutdown'),
        ('part_replacement', 'Part Replacement'),
    ]

    Report_Type=models.CharField(max_length=50, choices=Report_Types)
    equipment=models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='performance_reports')
    generated_at=models.DateTimeField(auto_now_add=True)
    content=models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.Report_Type} Report for {self.equipment.name} on {self.generated_at.strftime('%Y-%m-%d')}"
    







