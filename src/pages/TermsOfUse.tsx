import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-300">
            <div className="container mx-auto max-w-4xl px-4 py-16">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5"/>
                    <span>Назад</span>
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Умови використання
                    </h1>
                    <p className="text-gray-400">
                        Оновлено: 03.02.2026
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Intro */}
                    <section className="bg-gray-900/100 rounded-lg p-8">
                        <p className="text-lg leading-relaxed">
                            Ласкаво просимо до нашого сервісу збору відгуків для Instagram-магазинів.
                            Використовуючи наш сервіс, ви погоджуєтеся дотримуватися цих умов.
                            Будь ласка, уважно ознайомтеся з ними перед використанням платформи.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            1. Прийняття умов
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed text-gray-400">
                                Реєструючись та використовуючи наш сервіс, ви підтверджуєте, що:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Вам виповнилося 18 років або ви маєте згоду батьків/опікунів</li>
                                <li>• Ви надаєте точну та актуальну інформацію при реєстрації</li>
                                <li>• Ви погоджуєтеся дотримуватися цих умов використання</li>
                                <li>• Ви несете відповідальність за всю активність у вашому акаунті</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            2. Опис сервісу
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed">
                                Наш сервіс надає платформу для:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Збору відгуків від покупців Instagram-магазинів</li>
                                <li>• Генерації унікальних посилань для залишення відгуків</li>
                                <li>• Відображення відгуків на публічній сторінці</li>
                                <li>• Управління відгуками через особистий кабінет</li>
                            </ul>
                            <p className="leading-relaxed text-gray-400 pt-4">
                                Ми залишаємо за собою право змінювати, призупиняти або припиняти будь-які
                                функції сервісу без попереднього повідомлення.
                            </p>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            3. Реєстрація та акаунт
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed">
                                При реєстрації через Google ви зобов'язуєтесь:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Надавати точну інформацію про себе</li>
                                <li>• Підтримувати безпеку свого акаунту</li>
                                <li>• Негайно повідомляти про несанкціонований доступ</li>
                                <li>• Не передавати доступ до акаунту третім особам</li>
                                <li>• Не створювати більше одного акаунту без дозволу</li>
                            </ul>
                            <p className="leading-relaxed text-gray-400 pt-4">
                                Ми залишаємо за собою право відмовити в реєстрації або призупинити акаунт
                                за порушення цих умов.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            4. Правила використання
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed mb-4">
                                Використовуючи наш сервіс, ви погоджуєтесь <span
                                className="text-white font-semibold">НЕ</span>:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Публікувати фальшиві, оманливі або куплені відгуки</li>
                                <li>• Розміщувати незаконний, образливий, дискримінаційний контент</li>
                                <li>• Порушувати авторські права або інші права інтелектуальної власності</li>
                                <li>• Використовувати сервіс для спаму або шахрайства</li>
                                <li>• Намагатися отримати несанкціонований доступ до системи</li>
                                <li>• Використовувати автоматизовані засоби (боти) без дозволу</li>
                                <li>• Порушувати роботу сервісу або серверів</li>
                                <li>• Збирати дані інших користувачів без їх згоди</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            5. Контент та відгуки
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    Ваші права:
                                </h3>
                                <p className="leading-relaxed text-gray-400">
                                    Ви зберігаєте всі права на контент (відгуки, фото), який публікується через наш
                                    сервіс.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    Наша ліцензія:
                                </h3>
                                <p className="leading-relaxed text-gray-400">
                                    Розміщуючи контент, ви надаєте нам невиключну, безкоштовну ліцензію на
                                    використання, зберігання та відображення цього контенту для надання послуг.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    Модерація:
                                </h3>
                                <p className="leading-relaxed text-gray-400">
                                    Ми залишаємо за собою право видаляти контент, який порушує ці умови,
                                    без попереднього повідомлення та без компенсації.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            6. Тарифи та оплата
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed text-gray-400">
                                Наразі сервіс надається безкоштовно. При запровадженні платних тарифів:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Ви будете повідомлені завчасно про зміни в тарифікації</li>
                                <li>• Всі ціни будуть чітко вказані на сторінці тарифів</li>
                                <li>• Оплата здійснюється через безпечні платіжні системи</li>
                                <li>• Повернення коштів регулюється окремою політикою повернення</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            7. Обмеження відповідальності
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed text-gray-400">
                                Сервіс надається "як є" без будь-яких гарантій. Ми не несемо відповідальності за:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Втрату даних або доходів</li>
                                <li>• Технічні збої або недоступність сервісу</li>
                                <li>• Контент, розміщений користувачами</li>
                                <li>• Дії третіх осіб</li>
                                <li>• Непрямі, випадкові або штрафні збитки</li>
                            </ul>
                            <p className="leading-relaxed text-gray-400 pt-4">
                                Максимальна відповідальність обмежена сумою, яку ви сплатили за сервіс
                                протягом останніх 12 місяців.
                            </p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            8. Припинення використання
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed mb-4">
                                Ви можете припинити використання сервісу в будь-який час, видаливши свій акаунт.
                            </p>
                            <p className="leading-relaxed text-gray-400">
                                Ми залишаємо за собою право призупинити або видалити ваш акаунт у випадку:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Порушення цих умов використання</li>
                                <li>• Неактивності протягом тривалого періоду</li>
                                <li>• За вашим запитом</li>
                                <li>• При припиненні роботи сервісу</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            9. Зміни в умовах
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed text-gray-400">
                                Ми залишаємо за собою право оновлювати ці умови в будь-який час.
                                Про суттєві зміни ми повідомимо через email або в особистому кабінеті.
                                Продовження використання сервісу після змін означає вашу згоду з новими умовами.
                            </p>
                        </div>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            10. Застосовне право
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed text-gray-400">
                                Ці умови регулюються законодавством України. Будь-які спори вирішуються
                                шляхом переговорів, а у разі неможливості досягнення згоди - у відповідних судах
                                України.
                            </p>
                        </div>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            11. Контактна інформація
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed text-gray-400 mb-4">
                                Якщо у вас є питання щодо цих умов використання, зв'яжіться з нами:
                            </p>
                            <div className="space-y-2 text-gray-400">
                                <p>Email: <span className="text-white">support@reviewinbio.com</span></p>
                            </div>
                        </div>
                    </section>

                    {/* Footer note */}
                    <section className="text-center pt-8">
                        <p className="text-sm text-gray-500">
                            Останнє оновлення: 03.02.2026. Використовуючи наш сервіс,
                            ви погоджуєтеся з цими умовами.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;