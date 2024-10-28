# Generated by Django 5.1.1 on 2024-10-21 11:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tictac', '0007_alter_userprofile_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='is_draw',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='room',
            name='winner',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]