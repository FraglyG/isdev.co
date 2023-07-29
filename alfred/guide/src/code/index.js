// JavaScript to handle FAQ button clicks
const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const faqNumber = button.getAttribute('data-faq');
        const faqAnswer = document.querySelector(`.faq-answer[data-faq="${faqNumber}"]`);
        faqAnswer.classList.toggle('active');
        console.log('active')
    });
});
