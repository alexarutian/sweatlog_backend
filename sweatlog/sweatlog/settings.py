"""
Django settings for sweatlog project.

Generated by 'django-admin startproject' using Django 4.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from pathlib import Path
import os
import dj_database_url


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-z&22n3qmx(1^^xhfxp6zk4$gn2!1ay!ie#-0w072vv-4ssvw#o"

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True
DEBUG = "DJANGO_PRODUCTION" not in os.environ  # if in production, debug = False
DEPLOYED = "DJANGO_DEPLOYED" in os.environ

ALLOWED_HOSTS = []
MAIN_HOST = ""


if not DEPLOYED:
    ALLOWED_HOSTS.extend(
        [
            "127.0.0.1",
            "localhost",
            "testserver",  # added to allow python Client testing
        ]
    )
    MAIN_HOST = "http://127.0.0.1:8000"

elif DEBUG:
    ALLOWED_HOSTS.extend(
        [
            "sweatlog-staging.herokuapp.com",
        ]
    )
    MAIN_HOST = "https://sweatlog-staging.herokuapp.com"

# Application definition

INSTALLED_APPS = [
    "whitenoise.runserver_nostatic",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "webapp.apps.WebappConfig",  # webapp App connection
    "vue_app.apps.VueAppConfig",  # vue App connection
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "sweatlog.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # says also look for project templates
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "sweatlog.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

database_url = os.getenv("DATABASE_URL", f"sqlite:////{ BASE_DIR }/db.sqlite3")

DATABASES = {
    # "default": {
    #     "ENGINE": "django.db.backends.sqlite3",
    #     "NAME": BASE_DIR / "db.sqlite3",
    # },
    "default": dj_database_url.parse(database_url, conn_max_age=600),
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "America/Los_Angeles"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "static/"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "webapp.User"

# Direct to here with any login-restricted views
LOGIN_URL = "/accounts/login/"

# Redirect to home URL after login (Default redirects to /accounts/profile/)
LOGIN_REDIRECT_URL = "/vue_app/site/"

# console-logs emails sent FOR NOW (set up google email account)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
