from django.shortcuts import render

# Create your views here.


def vue_index(request):
    return render(request, "vue_app/index.html")
