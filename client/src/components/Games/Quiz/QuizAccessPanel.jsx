// client/src/components/Games/Quiz/QuizAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import ActivityTypes from '../../../utils/activityTypes'

function QuizAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.questionnaire.value}
            icon="❓"
            title="Centro de Quiz"
            subtitle="Pon a prueba tus conocimientos de Mazahua"
            gameBasePath="/games/quiz"
            cardIcon="❓"
            tipStudent="Los quizzes tienen múltiples opciones de respuesta"
            tipTeacher="Crea quizzes personalizados y evalúa a tus alumnos"
        />
    );
}

export default QuizAccessPanel;
