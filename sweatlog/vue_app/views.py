from django.shortcuts import render


def vue_index(request):

    # separating into if-else removes possibility of "none" type being stored as string on client side
    if request.session.get("user_token") is not None:
        context = {"user_token": request.session.get("user_token")}
        return render(request, "vue_app/index.html", context)

    else:
        return render(request, "vue_app/index.html")
