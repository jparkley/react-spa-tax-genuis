import { AppHeader } from './components/layout/AppHeader';
import { TwoColumnLayout } from './components/layout/TwoColumnLayout';
import { InputPanel } from './components/inputs/InputPanel';
import { ResultsPanel } from './components/results/ResultsPanel';
import { useTaxCalculator } from './hooks/useTaxCalculator';

export default function App() {
  const { inputs, results, setField, reset } = useTaxCalculator();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <TwoColumnLayout
        left={
          <InputPanel
            inputs={inputs}
            results={results}
            setField={setField}
            onReset={reset}
          />
        }
        right={
          <ResultsPanel
            results={results}
            taxYear={inputs.taxYear}
          />
        }
      />
    </div>
  );
}
