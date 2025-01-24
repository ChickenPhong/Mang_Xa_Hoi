from django.urls import path, include
from rest_framework.routers import DefaultRouter
from mangxahois import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'baidangs', views.BaiDangViewSet, basename='baidang')
router.register(r'binhluans', views.BinhLuanViewSet, basename='binhluan')
router.register(r'reactions', views.ReactionViewSet, basename='reaction')
router.register(r'khaosats', views.KhaoSatViewSet, basename='khaosat')
router.register(r'chats', views.ChatViewSet, basename='chat')
router.register(r'chatanhs', views.ChatAnhViewSet, basename='chatanh')
router.register(r'chattexts', views.ChatTextViewSet, basename='chattext')

urlpatterns = [
    path('', include(router.urls)),
    path('user-stats-api/', views.user_stats_api, name='user_stats_api'),
    path('get-available-years/', views.get_available_years, name='get_available_years'),
]
