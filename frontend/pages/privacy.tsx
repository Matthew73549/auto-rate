export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Политика конфиденциальности</h1>
      <p className="text-sm text-gray-600 mb-6">
        Последнее обновление: 06.09.2026
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Общие положения</h2>
        <p className="text-gray-700">
          Настоящая Политика конфиденциальности описывает, какие персональные данные собираются сервисом AutoRate (auto-rate.ru) и как они обрабатываются. Оператором данных является ИП _____ (в процессе регистрации).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Какие данные мы собираем</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Email и пароль (в хешированном виде) — для регистрации и входа.</li>
          <li>Город, роль (частный механик / СТО), ИНН (при указании) — для персонализации сервиса.</li>
          <li>Технические данные (IP‑адрес, браузер, время доступа) — для обеспечения безопасности и анализа работы Сервиса.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Цели обработки данных</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Предоставление доступа к Сервису и его функциям.</li>
          <li>Управление подпиской и доступом после пробного периода.</li>
          <li>Обеспечение безопасности и предотвращение злоупотреблений.</li>
          <li>Улучшение работы Сервиса на основе обезличенной статистики.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Передача данных третьим лицам</h2>
        <p className="text-gray-700">
          Мы не передаём персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ, а также случаев, необходимых для функционирования Сервиса (хостинг, платёжные системы после их подключения).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Защита данных</h2>
        <p className="text-gray-700">
          Мы принимаем технические и организационные меры для защиты персональных данных от утраты, несанкционированного доступа и изменения. Пароли хранятся в хешированном виде.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Контакты</h2>
        <p className="text-gray-700">
          По вопросам, связанным с обработкой персональных данных, вы можете обращаться на email: akhmed.mikhaltsov@inbox.ru
        </p>
      </section>
    </div>
  );
}