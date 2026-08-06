from django.urls import path

from apps.uploads.views import UploadView

urlpatterns = [
    path("uploads/", UploadView.as_view(), name="upload"),
]
