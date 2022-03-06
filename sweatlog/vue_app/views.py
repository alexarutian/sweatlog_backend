from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def vue_index(request):
    return render(request, "vue_app/index.html")
