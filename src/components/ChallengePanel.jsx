import React, { useEffect, useState } from 'react';

import {
  Brain,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  ArrowRight,
  RotateCcw,
  Target,
  Sparkles
} from 'lucide-react';

export default function ChallengePanel({
  challenge = null,
  score = 0,
  streak = 0,
  onAnswer = () => {},
  onNextChallenge = () => {},
  onReset = () => {},
  disabled = false
}) {
  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [isAnswered, setIsAnswered] =
    useState(false);

  const [isCorrect, setIsCorrect] =
    useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [challenge]);

  if (!challenge) {
    return (
      <section
        className="
          w-full
          rounded-2xl
          border
          border-purple-500/20
          bg-slate-950/80
          p-5
          shadow-xl
          backdrop-blur-md
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-purple-500/10
              border
              border-purple-500/20
              flex
              items-center
              justify-center
            "
          >
            <Brain
              size={20}
              className="text-purple-400"
            />
          </div>

          <div>
            <h2
              className="
                text-sm
                font-bold
                text-white
              "
            >
              Challenge Mode
            </h2>

            <p
              className="
                text-[11px]
                text-slate-500
                mt-1
              "
            >
              Predict what the algorithm will
              do next.
            </p>
          </div>
        </div>

        <div
          className="
            mt-5
            rounded-xl
            border
            border-slate-800
            bg-slate-900/60
            p-5
            text-center
          "
        >
          <Target
            size={28}
            className="
              mx-auto
              text-cyan-400
              mb-3
            "
          />

          <p
            className="
              text-sm
              text-slate-300
            "
          >
            No challenge is active.
          </p>

          <p
            className="
              text-xs
              text-slate-500
              mt-1
            "
          >
            Start an algorithm to generate
            a challenge.
          </p>
        </div>
      </section>
    );
  }

  const {
    title = 'Algorithm Challenge',
    description = '',
    question = 'What will happen next?',
    options = [],
    correctAnswer,
    explanation = '',
    points = 10,
    difficulty = 'Normal'
  } = challenge;

  const handleAnswer = (answer) => {
    if (
      isAnswered ||
      disabled
    ) {
      return;
    }

    const correct =
      answer === correctAnswer;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setIsCorrect(correct);

    onAnswer(
      answer,
      correct
    );
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);

    onNextChallenge();
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);

    onReset();
  };

  const getOptionClass = (
    option
  ) => {
    const base =
      `
        w-full
        text-left
        rounded-xl
        border
        px-4
        py-3
        transition-all
        duration-200
        flex
        items-center
        justify-between
        gap-3
      `;

    if (!isAnswered) {
      return (
        base +
        `
        border-slate-700
        bg-slate-900/70
        text-slate-300
        hover:border-cyan-500/60
        hover:bg-cyan-500/5
        hover:text-cyan-200
        `
      );
    }

    if (
      option === correctAnswer
    ) {
      return (
        base +
        `
        border-emerald-500/50
        bg-emerald-500/10
        text-emerald-300
        `
      );
    }

    if (
      option === selectedAnswer &&
      !isCorrect
    ) {
      return (
        base +
        `
        border-rose-500/50
        bg-rose-500/10
        text-rose-300
        `
      );
    }

    return (
      base +
      `
      border-slate-800
      bg-slate-900/40
      text-slate-500
      opacity-70
      `
    );
  };

  return (
    <section
      className="
        w-full
        rounded-2xl
        border
        border-purple-500/20
        bg-slate-950/80
        shadow-xl
        backdrop-blur-md
        overflow-hidden
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          p-5
          border-b
          border-slate-800
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-purple-500/10
                border
                border-purple-500/20
                flex
                items-center
                justify-center
              "
            >
              <Brain
                size={22}
                className="
                  text-purple-400
                "
              />
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <h2
                  className="
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {title}
                </h2>

                <span
                  className="
                    px-2
                    py-0.5
                    rounded-full
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-purple-300
                  "
                >
                  Challenge
                </span>
              </div>

              <p
                className="
                  text-[11px]
                  text-slate-500
                  mt-1
                "
              >
                {description ||
                  'Predict the next algorithm operation.'}
              </p>
            </div>

          </div>

          {/* Stats */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-amber-500/5
                border
                border-amber-500/20
              "
            >
              <Trophy
                size={14}
                className="
                  text-amber-400
                "
              />

              <div>
                <p
                  className="
                    text-[9px]
                    text-slate-500
                    uppercase
                  "
                >
                  Score
                </p>

                <p
                  className="
                    text-xs
                    font-bold
                    font-mono
                    text-amber-300
                  "
                >
                  {score}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-orange-500/5
                border
                border-orange-500/20
              "
            >
              <Flame
                size={14}
                className="
                  text-orange-400
                "
              />

              <div>
                <p
                  className="
                    text-[9px]
                    text-slate-500
                    uppercase
                  "
                >
                  Streak
                </p>

                <p
                  className="
                    text-xs
                    font-bold
                    font-mono
                    text-orange-300
                  "
                >
                  {streak}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          QUESTION
      ===================================================== */}

      <div
        className="
          p-5
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-2
            mb-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Sparkles
              size={15}
              className="
                text-cyan-400
              "
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-cyan-400
              "
            >
              Predict the Next Step
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                px-2
                py-1
                rounded-md
                bg-slate-900
                border
                border-slate-800
                text-[9px]
                text-slate-400
                uppercase
              "
            >
              {difficulty}
            </span>

            <span
              className="
                px-2
                py-1
                rounded-md
                bg-cyan-500/5
                border
                border-cyan-500/20
                text-[9px]
                text-cyan-300
                font-mono
              "
            >
              +{points} XP
            </span>

          </div>

        </div>

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900/70
            p-5
          "
        >

          <h3
            className="
              text-base
              md:text-lg
              font-bold
              text-white
              leading-relaxed
            "
          >
            {question}
          </h3>

        </div>

        {/* =================================================
            OPTIONS
        ================================================= */}

        <div
          className="
            mt-4
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
          "
        >

          {options.map(
            (
              option,
              index
            ) => {

              const isCorrectOption =
                option ===
                correctAnswer;

              const isSelected =
                option ===
                selectedAnswer;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={
                    isAnswered ||
                    disabled
                  }
                  onClick={() =>
                    handleAnswer(
                      option
                    )
                  }
                  className={
                    getOptionClass(
                      option
                    )
                  }
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className="
                        w-7
                        h-7
                        rounded-lg
                        bg-slate-800
                        border
                        border-slate-700
                        flex
                        items-center
                        justify-center
                        text-[10px]
                        font-bold
                        text-slate-400
                      "
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      {option}
                    </span>

                  </div>

                  {isAnswered &&
                    isCorrectOption && (
                      <CheckCircle2
                        size={18}
                        className="
                          text-emerald-400
                          shrink-0
                        "
                      />
                    )}

                  {isAnswered &&
                    isSelected &&
                    !isCorrectOption && (
                      <XCircle
                        size={18}
                        className="
                          text-rose-400
                          shrink-0
                        "
                      />
                    )}

                </button>
              );
            }
          )}

        </div>

        {/* =================================================
            RESULT
        ================================================= */}

        {isAnswered && (
          <div
            className={`
              mt-5
              rounded-xl
              border
              p-4
              ${
                isCorrect
                  ? `
                    border-emerald-500/30
                    bg-emerald-500/5
                  `
                  : `
                    border-rose-500/30
                    bg-rose-500/5
                  `
              }
            `}
          >

            <div
              className="
                flex
                items-start
                gap-3
              "
            >

              {isCorrect ? (
                <CheckCircle2
                  size={22}
                  className="
                    text-emerald-400
                    shrink-0
                  "
                />
              ) : (
                <XCircle
                  size={22}
                  className="
                    text-rose-400
                    shrink-0
                  "
                />
              )}

              <div>

                <h4
                  className={`
                    text-sm
                    font-bold
                    ${
                      isCorrect
                        ? 'text-emerald-300'
                        : 'text-rose-300'
                    }
                  `}
                >
                  {isCorrect
                    ? `Correct! +${points} XP`
                    : 'Not quite!'}
                </h4>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-slate-400
                  "
                >
                  {explanation ||
                    (
                      isCorrect
                        ? 'Excellent prediction. You correctly identified the next operation.'
                        : `The correct answer is "${correctAnswer}". Review the execution step and try the next challenge.`
                    )}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            justify-between
            gap-3
          "
        >

          <button
            type="button"
            onClick={
              handleReset
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              text-xs
              font-medium
              text-slate-400
              hover:text-white
              hover:border-slate-600
              transition
            "
          >
            <RotateCcw
              size={14}
            />

            Reset
          </button>

          {isAnswered && (
            <button
              type="button"
              onClick={
                handleNext
              }
              className="
                flex
                items-center
                gap-2
                px-5
                py-2
                rounded-xl
                bg-cyan-500
                text-slate-950
                text-xs
                font-bold
                hover:bg-cyan-400
                transition
              "
            >
              Next Challenge

              <ArrowRight
                size={15}
              />
            </button>
          )}

        </div>

      </div>

    </section>
  );
}