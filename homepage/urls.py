from django.urls import path
from . import views


urlpatterns = [
    # Home and Dashboard
    path('', views.homepage, name='homepage'),

    path('dashboard/', views.assistant_dashboard, name='assistant_dashboard'),
    path('setup-profile/', views.setup_profile, name='setup_profile'),
    path('signup/', views.signup, name='signup'),

    path('community/', views.community_feed, name='community'),
    path('create_post/', views.create_post, name='create_post'),
    path('post/<int:post_id>/like/', views.like_post, name='like_post'),
    path('post/<int:post_id>/comment/', views.comment_on_post, name='comment_on_post'),
    path('post/<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('comment/<int:comment_id>/delete/', views.delete_comment, name='delete_comment'),
path('recommendation/', views.investment_recommendation_view, name='investment_recommendation'),


    # Route for handling the quiz results
    path('quiz/result/', views.quiz_result, name='quiz_result'),
path('financial-resources/', views.financial_resources, name='financial_resources'),

    # Authentication URLs
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
path('chatbot/', views.chatbot_view, name='chatbot'),


    path('literacy/', views.literacy_games, name='literacy_games'),
    path('submit_score/', views.literacy_games, name='submit_score'),
    path('expenditure/', views.expenditure_view, name='expenditure_view'),

    # Post Detail (if you plan to add detailed view later)
    # path('post/<int:post_id>/', views.post_detail, name='post_detail'),
]
