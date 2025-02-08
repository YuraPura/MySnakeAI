### Обновление v0.00.1
    1. Добавлен рандом:
        -   При наличии нескольких безопастных ходов, использовать любой
        ```
        const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
        ```
# Краткая документация про "Генадий"

## Основные компоненты стратегии

### 1. Проверка безопасных ходов
- **Движение назад:** Ну это чтобы шею не сверуть
- **Границы поля:** Если следующий ход приводит к выходу за границы, он помечается как небезопасный.
- **Столкновения:** Рассматриваются клетки, занятые телом Геннадия и не Генадия, и такие направления исключаются.

### 2. Flood Fill
- Функция `floodFillCount` рассчитывает количество клеток, доступных из новой позиции, что позволяет оценить, сколько свободного пространства останется после выполнения хода.
- Этот метод позволяет Генадию не закручиваться раньше времени в рогалик.
### 3. Планирование движения к еде
- Вычисляется расстояние от потенциальной новой позиции до ближайшей еды.
- Алгоритм пытается выбирать ходы, которые минимизируют это расстояние, тем самым способствуя ДОМЕНИРОВАНИЮ Генадия (Ну это в теории)

### 4. Head-to-Head столкновения
- Если новый ход приводит к тому, что голова Генадия окажется рядом с головой НЕ Генадия, алгоритм оценивает их длину.
- Если НЕ Генадий равен или сильнее, применяется дебаф; если противник слабее – начисляется баф. Это позволяет Генадию агрессивно атаковать слабых противников, избегая при этом опасных ситуаций.

### 5. Дебаф за ограниченное свободное пространство (Low Area Penalty)
- Если свободное пространство (`openArea`) после хода оказывается недостаточным (например, меньше двойной длины Генадия), начисляется дополнительный дебаф. (Мне кажется, что это надо вырезать)
- Это должно помогать не закручиваться и не поподать в ловушки (На самом деле работает через раз)

## Итоговая оценка ходов
Для каждого безопасного направления рассчитывается итоговый счет по формуле:

```
score = openArea - foodDistance - headToHeadPenalty + headToHeadBonus - lowAreaPenalty
```

Где:
- **openArea** – Количество достижимых клеток из новой позиции.
- **foodDistance** – Расстояние до ближайшей еды.
- **headToHeadPenalty/Bonus** – Дебаф или баф за потенциальные столкновения с противниками.
- **lowAreaPenalty** – Дебаф за недостаток свободного пространства.

Ход с наивысшим итоговым счетом выбирается для следующего шага.

## Характер Генадия остовляет желать лучшего
# PS: Я знаю, что Генадий пишется с 2 буквами нн) У меня свой уникальный Генадий