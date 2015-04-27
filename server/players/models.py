from django.db import models

# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=64)
    score = models.IntegerField(default=0)
    color = models.CharField(max_length=16, default='black')
    icon = models.CharField(max_length=64, default='glyphicon-user')
