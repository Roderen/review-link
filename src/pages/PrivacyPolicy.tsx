import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
                        Політика конфіденційності
                    </h1>
                    <p className="text-gray-400">
                        Оновлено: 03.02.2026
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Intro */}
                    <section className="bg-gray-900/100 rounded-lg p-8">
                        <p className="text-lg leading-relaxed">
                            Ми цінуємо вашу конфіденційність і прагнемо захистити ваші персональні дані.
                            Ця політика конфіденційності пояснює, які дані ми збираємо, як ми їх використовуємо
                            та які права ви маєте щодо своїх даних.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            1. Які дані ми збираємо
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    Для власників магазинів (при реєстрації через Google):
                                </h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>• Ім'я та прізвище</li>
                                    <li>• Електронна адреса</li>
                                    <li>• Фото профілю Google</li>
                                    <li>• Унікальний ідентифікатор користувача</li>
                                    <li>• Дата створення акаунту</li>
                                    <li>• Налаштування акаунту та підписки</li>
                                </ul>
                            </div>
                            <div className="pt-4">
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    Для покупців (при залишенні відгуку):
                                </h3>
                                <ul className="space-y-2 text-gray-400">
                                    <li>• Ім'я (за бажанням)</li>
                                    <li>• Фото (за бажанням)</li>
                                    <li>• Текст відгуку</li>
                                    <li>• Оцінка (зірки)</li>
                                </ul>
                                <p className="text-sm text-gray-500 mt-4">
                                    Примітка: Покупці не зобов'язані реєструватися або надавати персональні дані для
                                    залишення відгуку.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            2. Як ми використовуємо ваші дані
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="mb-4 leading-relaxed">
                                Ми використовуємо зібрані дані виключно для наступних цілей:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Надання доступу до особистого кабінету</li>
                                <li>• Генерація персональних посилань для збору відгуків</li>
                                <li>• Відображення відгуків на публічній сторінці</li>
                                <li>• Управління підпискою та лімітами відгуків</li>
                                <li>• Покращення якості сервісу</li>
                                <li>• Технічна підтримка користувачів</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            3. Зберігання та захист даних
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8 space-y-4">
                            <p className="leading-relaxed">
                                Ваші дані зберігаються на захищених серверах Firebase (Google Cloud Platform)
                                з використанням сучасних стандартів безпеки.
                            </p>
                            <p className="leading-relaxed text-gray-400">
                                Ми вживаємо організаційних та технічних заходів для захисту ваших персональних
                                даних від несанкціонованого доступу, втрати або розголошення.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            4. Передача даних третім особам
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed mb-4">
                                Ми не продаємо, не передаємо і не розголошуємо ваші персональні дані третім особам,
                                за винятком наступних випадків:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• За вашою згодою</li>
                                <li>• Для надання сервісу (Google Cloud Platform/Firebase)</li>
                                <li>• Якщо це вимагається законодавством</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            5. Публічне відображення відгуків
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed text-gray-400">
                                Відгуки, залишені покупцями, можуть відображатися на публічній сторінці вашого магазину.
                                Покупці самостійно обирають, які дані (ім'я, фото) вказувати при залишенні відгуку.
                                Власник магазину може керувати налаштуваннями публічного відображення в особистому
                                кабінеті.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            6. Ваші права
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="mb-4 leading-relaxed">
                                Ви маєте право:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li>• Отримати доступ до своїх персональних даних</li>
                                <li>• Виправити неточні дані</li>
                                <li>• Видалити свій акаунт та всі пов'язані дані</li>
                                <li>• Відкликати згоду на обробку даних</li>
                                <li>• Експортувати свої дані</li>
                            </ul>
                            <p className="text-sm text-gray-500 mt-6">
                                Для реалізації своїх прав зв'яжіться з нами за контактними даними, зазначеними нижче.
                            </p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            7. Файли cookie
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed text-gray-400">
                                Ми використовуємо cookies для забезпечення функціонування сервісу, збереження
                                налаштувань та аналізу використання сайту. Ви можете налаштувати використання
                                cookies у своєму браузері.
                            </p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            8. Зміни в політиці конфіденційності
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed text-gray-400">
                                Ми залишаємо за собою право вносити зміни до цієї політики конфіденційності.
                                Про суттєві зміни ми повідомимо вас через email або повідомлення в особистому кабінеті.
                            </p>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            9. Контактна інформація
                        </h2>
                        <div className="bg-gray-900/100 rounded-lg p-8">
                            <p className="leading-relaxed text-gray-400 mb-4">
                                Якщо у вас є питання щодо цієї політики конфіденційності або ви хочете
                                скористатися своїми правами, зв'яжіться з нами:
                            </p>
                            <div className="space-y-2 text-gray-400">
                                <p>Email: <span className="text-white">support@reviewinbio.com</span></p>
                            </div>
                        </div>
                    </section>

                    {/* Footer note */}
                    <section className="text-center pt-8">
                        <p className="text-sm text-gray-500">
                            Використовуючи наш сервіс, ви погоджуєтеся з умовами цієї політики конфіденційності.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;