from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CommunityPost, Comment, FinancialProfile
from django.contrib.auth.models import User

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

class FinancialProfileForm(forms.ModelForm):
    class Meta:
        model = FinancialProfile
        fields = ['monthly_income', 'savings_goal', 'budget_plan']

class CommunityPostForm(forms.ModelForm):
    class Meta:
        model = CommunityPost
        fields = ['title', 'content', 'media']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Add a comment...'}),
        }

class ExpenditureForm(forms.Form):
    rent = forms.DecimalField(decimal_places=2, max_digits=10, label='Rent')
    groceries = forms.DecimalField(decimal_places=2, max_digits=10, label='Groceries')
    utilities = forms.DecimalField(decimal_places=2, max_digits=10, label='Utilities')
    transportation = forms.DecimalField(decimal_places=2, max_digits=10, label='Transportation')
    healthcare = forms.DecimalField(decimal_places=2, max_digits=10, label='Healthcare')
    entertainment = forms.DecimalField(decimal_places=2, max_digits=10, label='Entertainment')
    savings = forms.DecimalField(decimal_places=2, max_digits=10, label='Savings')
    others = forms.DecimalField(decimal_places=2, max_digits=10, label='Others')

#from django import forms

from django import forms

class InvestmentForm(forms.Form):
    gender = forms.ChoiceField(choices=[('Male', 'Male'), ('Female', 'Female')], widget=forms.Select(attrs={'placeholder': 'Select Gender'}))
    age = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Enter your age'}))
    Investment_Avenues = forms.ChoiceField(choices=[('Yes', 'Yes'), ('No', 'No')], widget=forms.Select(attrs={'placeholder': 'Select Yes or No'}))
    mutual_funds = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Preference on a scale of 1 to 7'}))
    equity_market = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Preference on a scale of 1 to 7'}))
    debentures = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Preference on a scale of 1 to 7'}))
    government_bonds = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Preference on a scale of 1 to 7'}))
    fixed_deposits = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Preference on a scale of 1 to 7'}))
    ppf = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Preference on a scale of 1 to 7'}))
    gold = forms.IntegerField(widget=forms.NumberInput(attrs={'placeholder': 'Preference on a scale of 1 to 7'}))
    stock_market = forms.ChoiceField(choices=[('Yes', 'Yes'), ('No', 'No')], widget=forms.Select(attrs={'placeholder': 'Select Yes or No'}))
    factor = forms.ChoiceField(choices=[('Returns', 'Returns'), ('Locking Period', 'Locking Period')], widget=forms.Select(attrs={'placeholder': 'Select Factor'}))
    purpose = forms.ChoiceField(choices=[('Wealth Creation', 'Wealth Creation'),('Savings for Future', 'Savings for Future'),('Returns', 'Returns'),('Early Retirement', 'Early Retirement')], widget=forms.Select(attrs={'placeholder': 'Select Factor'}))
    duration = forms.ChoiceField(choices=[('Less than 1 year', 'Less than 1 year'),
                                          ('1-3 years', '1-3 years'),
                                          ('3-5 years', '3-5 years'),
                                          ('More than 5 years', 'More than 5 years')],
                                widget=forms.Select(attrs={'placeholder': 'Select investment duration'}))
    invest_monitor = forms.ChoiceField(choices=[('Daily', 'Daily'), ('Weekly', 'Weekly'), ('Monthly', 'Monthly')],
                                       widget=forms.Select(attrs={'placeholder': 'Select monitoring frequency'}))
    expect = forms.ChoiceField(choices=[('10%-20%', '10%-20%'), ('20%-30%', '20%-30%')],
                               widget=forms.Select(attrs={'placeholder': 'Expected returns'}))
    avenue = forms.ChoiceField(choices=[('Mutual Fund', 'Mutual Fund'), ('Equity', 'Equity')],
                               widget=forms.Select(attrs={'placeholder': 'Select preferred investment avenue'}))
    source = forms.ChoiceField(choices=[('Newspapers and Magazines', 'Newspapers and Magazines'),
                                        ('Financial Consultants', 'Financial Consultants'),
                                        ('Television', 'Television'),
                                        ('Internet', 'Internet')],
                               widget=forms.Select(attrs={'placeholder': 'Select the source of investment advice'}))
    salary = forms.FloatField(widget=forms.NumberInput(attrs={'placeholder': 'Enter your salary'}))
