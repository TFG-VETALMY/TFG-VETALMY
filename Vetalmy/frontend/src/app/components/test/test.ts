import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar'; // Opcional, para mostrar el progreso

interface Option {
  text: string;
  animal: 'perro' | 'gato' | 'pajaro' | 'hamster';
}

interface Question {
  question: string;
  options: Option[];
}

@Component({
  selector: 'app-animal-test',
  standalone: true, // Asegúrate de que esto esté aquí
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressBarModule
  ],
  templateUrl: './test.html',
  styleUrls: ['./test.css']
})
export class Test {

  questions: Question[] = [
    {
      question: '¿Qué prefieres hacer en tu tiempo libre?',
      options: [
        { text: 'Dormir en un sitio cómodo', animal: 'gato' },
        { text: 'Salir a correr o jugar', animal: 'perro' },
        { text: 'Cantar o escuchar música', animal: 'pajaro' },
        { text: 'Comer snacks tranquilamente en casa', animal: 'hamster' }
      ]
    },
    {
      question: '¿Cuál es tu lugar favorito para relajarte?',
      options: [
        { text: 'Un parque al aire libre', animal: 'perro' },
        { text: 'El sofá o una cama muy suave', animal: 'gato' },
        { text: 'Un rincón pequeñito y acogedor', animal: 'hamster' },
        { text: 'Un lugar alto con buenas vistas', animal: 'pajaro' }
      ]
    },
    {
      question: '¿Cómo reaccionas cuando conoces a alguien nuevo?',
      options: [
        { text: 'Voy a saludar súper emocionado', animal: 'perro' },
        { text: 'Lo observo desde lejos primero', animal: 'gato' },
        { text: 'Hablo un poco si me da buena espina', animal: 'pajaro' },
        { text: 'Soy un poco tímido al principio', animal: 'hamster' }
      ]
    },
    {
      question: '¿Cuál de estas comidas elegirías sin dudarlo?',
      options: [
        { text: '¡De todo! Me encanta comer', animal: 'perro' },
        { text: 'Pescado o algo muy gourmet', animal: 'gato' },
        { text: 'Frutas y semillas', animal: 'pajaro' },
        { text: 'Frutos secos y vegetales crujientes', animal: 'hamster' }
      ]
    },
    {
      question: '¿Cuál crees que es tu mayor cualidad?',
      options: [
        { text: 'Soy muy leal y divertido', animal: 'perro' },
        { text: 'Soy independiente y elegante', animal: 'gato' },
        { text: 'Soy libre y creativo', animal: 'pajaro' },
        { text: 'Soy trabajador y adorable', animal: 'hamster' }
      ]
    }
  ];

  scores = {
    perro: 0,
    gato: 0,
    pajaro: 0,
    hamster: 0
  };

  animalInfo = {
    perro: {
      name: '¡Eres un Perro!',
      icon: 'bx bx-dog-body',
      desc: 'Eres leal, enérgico y te encanta estar rodeado de tus seres queridos.'
    },
    gato: {
      name: '¡Eres un Gato!',
      icon: 'bx bx-cat',
      desc: 'Eres independiente, observador y sabes disfrutar de los pequeños placeres.'
    },
    pajaro: {
      name: '¡Eres un Pájaro!',
      icon: 'bx bx-bird',
      desc: 'Eres un espíritu libre, comunicativo y siempre ves las cosas desde otra perspectiva.'
    },
    hamster: { 
      name: '¡Eres un Hámster!', 
      icon: 'bx bx-bear',
      desc: 'Eres adorable, un poco reservado al principio pero muy trabajador y hogareño.' 
    }
  };

  currentQuestionIndex = 0;
  testFinished = false;
  finalAnimal: 'perro' | 'gato' | 'pajaro' | 'hamster' | null = null;

  // Calcula el progreso en porcentaje
  get progress(): number {
    return (this.currentQuestionIndex / this.questions.length) * 100;
  }

  selectOption(animalCategory: 'perro' | 'gato' | 'pajaro' | 'hamster') {
    // Sumamos un punto a la categoría elegida
    this.scores[animalCategory]++;

    // Pasamos a la siguiente pregunta o finalizamos
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    // Buscamos la categoría con la mayor puntuación
    const categories = Object.keys(this.scores) as Array<keyof typeof this.scores>;

    this.finalAnimal = categories.reduce((a, b) =>
      this.scores[a] > this.scores[b] ? a : b
    );

    this.testFinished = true;
  }

  resetTest() {
    this.scores = { perro: 0, gato: 0, pajaro: 0, hamster: 0 };
    this.currentQuestionIndex = 0;
    this.testFinished = false;
    this.finalAnimal = null;
  }
}