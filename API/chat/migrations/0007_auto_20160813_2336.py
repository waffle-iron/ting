# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0006_tinguser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tinguser',
            name='birthday',
            field=models.DateTimeField(default=None, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='tinguser',
            name='gender',
            field=models.IntegerField(default=3, blank=True, choices=[(0, b'Male'), (1, b'Female'), (2, b'Other'), (3, b'None')]),
        ),
    ]
