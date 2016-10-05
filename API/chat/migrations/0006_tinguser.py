# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0005_auto_20160511_1921'),
    ]

    operations = [
        migrations.CreateModel(
            name='TingUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('gender', models.IntegerField(default=None, choices=[(0, b'Male'), (1, b'Female'), (2, b'Other'), (3, b'None')])),
                ('birthday', models.DateTimeField(default=None)),
                ('reserved', models.BooleanField(default=False)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
