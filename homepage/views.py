from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm, CommunityPostForm, CommentForm, FinancialProfileForm
from .models import CommunityPost, Comment, FinancialProfile
from django.contrib.auth.decorators import login_required
from .models import CommunityPost, Comment
from .forms import CommunityPostForm, CommentForm
from .models import CommunityPost, Comment
from .forms import CommunityPostForm, CommentForm
from django.shortcuts import render
from .forms import ExpenditureForm
from .utils import plot_pie_chart
from django.shortcuts import render
from .forms import ExpenditureForm
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import urllib, base64



def homepage(request):
    user = request.user
    return render(request, 'homepage.html')

def logout_user(request):
    logout(request)
    return redirect('homepage')


def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)
            return redirect('homepage')
        else:

            return render(request, 'register.html', {'form': form})
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

def community_feed(request):
    posts = CommunityPost.objects.all().order_by('-created_at')
    return render(request, 'community/community_feed.html', {'posts': posts})


def create_post(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        media = request.FILES.get('media')
        post = CommunityPost(user=request.user, title=title, content=content, media=media)
        post.save()
        return redirect('community')
    return render(request, 'community_feed.html')


def like_post(request, post_id):
    post = CommunityPost.objects.get(id=post_id)
    if request.user in post.likes.all():
        post.likes.remove(request.user)
    else:
        post.likes.add(request.user)
    return redirect('community')


def comment_on_post(request, post_id):
    if request.method == 'POST':
        content = request.POST.get('content')
        post = CommunityPost.objects.get(id=post_id)
        comment = Comment(user=request.user, post=post, content=content)
        comment.save()
    return redirect('community')

def post_detail(request, post_id):
    post = get_object_or_404(CommunityPost, id=post_id)
    if request.method == 'POST':
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.user = request.user
            comment.post = post
            comment.save()
            return redirect('community/post_detail', post_id=post_id)
    else:
        comment_form = CommentForm()
    return render(request, 'community/post_detail.html', {'post': post, 'comment_form': comment_form})

def assistant_dashboard(request):
    profile = get_object_or_404(FinancialProfile, user=request.user)
    return render(request, 'assistant_dashboard.html', {'profile': profile})


def delete_post(request, post_id):
    post = get_object_or_404(CommunityPost, id=post_id)
    if request.user == post.user:
        post.delete()
    return redirect('community')

def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    if request.method == 'POST':
        if request.user == comment.user:
            comment.delete()
        return redirect('community')
from .models import FinancialLiteracyScore
def literacy_games(request):
    if request.method == 'POST':
        score = request.POST.get('score')
        FinancialLiteracyScore.objects.create(user=request.user, score=score)


        user_rank = calculate_rank(request.user)
        financial_literacy_level = determine_literacy_level(score)
        financial_tips = get_financial_tips(score)

        return render(request, 'literacy_games.html', {
            'user_rank': user_rank,
            'financial_literacy_level': financial_literacy_level,
            'financial_tips': financial_tips,
        })

    return render(request, 'literacy_games.html')
@login_required
def setup_profile(request):
    try:
        profile = request.user.financialprofile
    except FinancialProfile.DoesNotExist:
        profile = FinancialProfile(user=request.user)

    if request.method == 'POST':
        form = FinancialProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('assistant_dashboard')
    else:
        form = FinancialProfileForm(instance=profile)

    return render(request, 'setup_profile.html', {'form': form})

def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('homepage')
        else:

            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')




def quiz_result(request):
    if request.method == 'POST':
        answers = request.POST
        score = 0

        correct_answers = {
            'q1': 'b',
            'q2': 'b',
            'q3': 'b',
            'q4': 'b',
            'q5': 'b',
            'q6': 'b',
            'q7': 'b',
            'q8': 'a',
            'q9': 'b',
            'q10': 'a',
        }

        for question, answer in answers.items():
            if question in correct_answers and correct_answers[question] == answer:
                score += 1

        feedback = generate_personalized_feedback(score)
        return JsonResponse({'score': score, 'feedback': feedback})

    return render(request, 'literacy_games.html')

def financial_resources(request):
    return render(request, 'financial_resources.html')
def plot_pie_chart(user_data):
    labels = ['Rent', 'Groceries', 'Utilities', 'Transportation', 'Healthcare', 'Entertainment', 'Savings', 'Others']
    sizes = [
        user_data['rent'],
        user_data['groceries'],
        user_data['utilities'],
        user_data['transportation'],
        user_data['healthcare'],
        user_data['entertainment'],
        user_data['savings'],
        user_data['others']
    ]


    colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c2f0c2', '#e6e6e6']
    explode = (0.1, 0, 0, 0, 0, 0, 0, 0)
    fig, ax = plt.subplots()
    wedges, texts, autotexts = ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140,
                                      colors=colors, explode=explode, shadow=True, wedgeprops=dict(width=0.3))


    for text in texts + autotexts:
        text.set_fontsize(12)
        text.set_color('black')

    ax.axis('equal')
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()
    plt.close(fig)

    return img_str


def chatbot_view(request):
    return render(request, 'chatbot.html')


from django.shortcuts import render
from .forms import InvestmentForm
from .model_utils import make_prediction

from django.shortcuts import render
from .forms import InvestmentForm
import pandas as pd

from sklearn.preprocessing import LabelEncoder

from django.shortcuts import render
from .forms import InvestmentForm  # Make sure this import matches your form's location
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf

def investment_recommendation_view(request):
    if request.method == 'POST':
        form = InvestmentForm(request.POST)
        if form.is_valid():
            # Load model and preprocessor
            model = tf.keras.models.load_model('model.h5')
            preprocessor = joblib.load('preprocessor.pkl')
            label_encoder = joblib.load('label_encoder.pkl')

            # Prepare input data
            data = {
                'gender': form.cleaned_data['gender'],
                'age': form.cleaned_data['age'],
                'Investment_Avenues': form.cleaned_data['Investment_Avenues'],
                'Mutual_Funds': form.cleaned_data['mutual_funds'],
                'Equity_Market': form.cleaned_data['equity_market'],
                'Debentures': form.cleaned_data['debentures'],
                'Government_Bonds': form.cleaned_data['government_bonds'],
                'Fixed_Deposits': form.cleaned_data['fixed_deposits'],
                'PPF': form.cleaned_data['ppf'],
                'Gold': form.cleaned_data['gold'],
                'Stock_Market': form.cleaned_data['stock_market'],
                'Factor': form.cleaned_data['factor'],
                'Purpose': form.cleaned_data['purpose'],
                'Duration': form.cleaned_data['duration'],
                'Invest_Monitor': form.cleaned_data['invest_monitor'],
                'Expect': form.cleaned_data['expect'],
                'Avenue': form.cleaned_data['avenue'],
                'Source': form.cleaned_data['source'],
                'Salary': form.cleaned_data['salary'],
            # Include all other form fields here
            }
            new_data = pd.DataFrame(data)
            new_data_processed = preprocessor.transform(new_data)

            # Predict
            new_predictions = model.predict(new_data_processed)
            new_predictions_classes = new_predictions.argmax(axis=1)
            predicted_recommendations = label_encoder.inverse_transform(new_predictions_classes)

            context = {
                'form': form,
                'prediction': predicted_recommendations[0],
            }
            return render(request, 'ml_result.html', context)
    else:
        form = InvestmentForm()
    return render(request, 'ml_predict.html', {'form': form})

def expenditure_view(request):
    if request.method == 'POST':
        form = ExpenditureForm(request.POST)
        if form.is_valid():
            user_data = form.cleaned_data
            total = sum(user_data.values())
            percentages = {key: (value / total) * 100 for key, value in user_data.items()}

            chart = plot_pie_chart(user_data)

            context = {
                'chart': chart,
                'user_data': user_data,
                'rent_percentage': percentages.get('rent', 0),
                'groceries_percentage': percentages.get('groceries', 0),
                'utilities_percentage': percentages.get('utilities', 0),
                'transportation_percentage': percentages.get('transportation', 0),
                'healthcare_percentage': percentages.get('healthcare', 0),
                'entertainment_percentage': percentages.get('entertainment', 0),
                'savings_percentage': percentages.get('savings', 0),
                'others_percentage': percentages.get('others', 0),
            }
            return render(request, 'results.html', context)
    else:
        form = ExpenditureForm()

    return render(request, 'expenditure_form.html', {'form': form})


