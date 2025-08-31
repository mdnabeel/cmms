from django.contrib import admin
from .models import User, Team, Equipment, SparePart, SpareTransaction, PurchaseRequest, WorkOrder, MaintenanceSchedule, PerformanceReport


# Register your models here.
admin.site.register(User)
admin.site.register(Team)
admin.site.register(Equipment)
admin.site.register(SparePart)
admin.site.register(SpareTransaction)
admin.site.register(PurchaseRequest)
admin.site.register(WorkOrder)
admin.site.register(MaintenanceSchedule)
admin.site.register(PerformanceReport)