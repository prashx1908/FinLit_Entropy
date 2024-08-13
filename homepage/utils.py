import matplotlib.pyplot as plt
import io
import base64

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
    explode = (0.1, 0, 0, 0, 0, 0, 0, 0)  # explode 1st slice

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
