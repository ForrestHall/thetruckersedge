'use client'

import { useState, useCallback } from 'react'

interface Answer {
  id?: string
  text: string
  correct: boolean
}

interface Question {
  id?: string
  question: string
  answers: Answer[]
  explanation?: string | null
}

interface Props {
  questions: Question[]
  testTitle: string
}

type QuestionState = 'unanswered' | 'correct' | 'incorrect'

export function PracticeTestClient({ questions, testTitle }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<QuestionState[]>(
    Array(questions.length).fill('unanswered')
  )
  const [finished, setFinished] = useState(false)

  const q = questions[current]
  const score = results.filter((r) => r === 'correct').length
  const pct = Math.round((score / questions.length) * 100)

  const handleAnswer = useCallback(
    (answerIdx: number) => {
      if (revealed) return
      setSelected(String(answerIdx))
      setRevealed(true)
      const answer = q.answers[answerIdx]
      const newResults = [...results]
      newResults[current] = answer?.correct ? 'correct' : 'incorrect'
      setResults(newResults)
    },
    [revealed, q, results, current]
  )

  const handleNext = useCallback(() => {
    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setFinished(true)
    }
  }, [current, questions.length])

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setResults(Array(questions.length).fill('unanswered'))
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className={`text-6xl font-extrabold mb-2 ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
          {pct}%
        </div>
        <p className="text-xl font-bold text-brand-navy mb-1">
          {score} / {questions.length} correct
        </p>
        <p className="text-gray-500 mb-2">
          {pct >= 80
            ? 'Great work — you\'re ready for the real exam!'
            : pct >= 60
            ? 'Good progress. Review the missed questions and try again.'
            : 'Keep studying — the real exam requires 80% to pass.'}
        </p>

        <div className="w-full bg-gray-100 rounded-full h-3 my-6 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={handleRestart} className="btn-primary">
            Retake Test
          </button>
          <a href="/practice-tests" className="btn-secondary">
            Try Another Test
          </a>
        </div>

        {/* Result summary */}
        <div className="mt-8 text-left space-y-2">
          {questions.map((q, i) => (
            <div key={q.id ?? i} className={`flex items-start gap-3 p-3 rounded-lg text-sm ${results[i] === 'correct' ? 'bg-green-50' : 'bg-red-50'}`}>
              <span className={`font-bold mt-0.5 ${results[i] === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                {results[i] === 'correct' ? '✓' : '✗'}
              </span>
              <span className="text-gray-700">{q.question}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const correctAnswer = q.answers.find((a) => a.correct)

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>Question {current + 1} of {questions.length}</span>
        <span>{results.filter((r) => r === 'correct').length} correct</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className="bg-brand-yellow h-full rounded-full transition-all duration-300"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold text-brand-navy mb-6 leading-snug">{q.question}</h2>

        <div className="space-y-3 mb-6">
          {q.answers.map((answer, idx) => {
            let style = 'border-gray-200 bg-white hover:border-brand-yellow hover:bg-yellow-50 cursor-pointer'
            if (revealed) {
              if (answer.correct) {
                style = 'border-green-500 bg-green-50 cursor-default'
              } else if (selected === String(idx)) {
                style = 'border-red-400 bg-red-50 cursor-default'
              } else {
                style = 'border-gray-200 bg-gray-50 cursor-default opacity-60'
              }
            }

            return (
              <button
                key={answer.id ?? idx}
                onClick={() => handleAnswer(idx)}
                disabled={revealed}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 font-medium text-gray-800 ${style}`}
              >
                <span className="flex items-center gap-3">
                  {revealed && answer.correct && <span className="text-green-600 font-bold">✓</span>}
                  {revealed && selected === String(idx) && !answer.correct && (
                    <span className="text-red-500 font-bold">✗</span>
                  )}
                  {answer.text}
                </span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {revealed && q.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800 leading-relaxed">
            <strong className="block mb-1">Explanation:</strong>
            {q.explanation}
          </div>
        )}

        {/* Next button */}
        {revealed && (
          <button onClick={handleNext} className="btn-primary w-full justify-center">
            {current < questions.length - 1 ? 'Next Question →' : 'See My Results'}
          </button>
        )}
      </div>
    </div>
  )
}
