// client/src/components/Games/Quiz/QuizAccessPanel.js
import React from 'react';
import GameAccessPanel from '../GamePanel/GameAccessPanel';
import { ActivityTypes } from '../../../config/activityConfig'
import IconQuiz from '../../../assets/svgs/juegos/quiz_premium.svg';

function QuizAccessPanel() {
    return (
        <GameAccessPanel
            gameType={ActivityTypes.QUESTIONNAIRE}
            icon={<img src={IconQuiz} alt="Quiz" className="w-12 h-12" />}
            title="Centro de Quiz"
            subtitle="Pon a prueba tus conocimientos de Mazahua"
            gameBasePath="/games/quiz"
            cardIcon={<img src={IconQuiz} alt="Quiz" className="w-6 h-6" />}
            tipStudent="Los quizzes tienen múltiples opciones de respuesta"
            tipTeacher="Crea quizzes personalizados y evalúa a tus alumnos"
        />
    );
}

export default QuizAccessPanel;
