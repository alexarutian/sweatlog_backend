# Generated by Django 4.0.1 on 2022-01-27 00:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0002_workoutlog_date_alter_block_date_alter_workout_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='equipment_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='webapp.equipmenttype'),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='exercise_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='webapp.exercisetype'),
        ),
    ]
