import { useGameStore } from '../store/gameStore';
import { HOUSING_OPTIONS, CAR_OPTIONS } from '../data/assets';
import { formatMoney } from '../utils/format';
import { Card, SectionTitle } from './Card';

export function LifePanel() {
  const character = useGameStore((s) => s.character)!;
  const buyHouse = useGameStore((s) => s.buyHouse);
  const sellHouse = useGameStore((s) => s.sellHouse);
  const buyCar = useGameStore((s) => s.buyCar);
  const sellCar = useGameStore((s) => s.sellCar);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Housing</SectionTitle>
          {character.housing.price > 0 && (
            <button onClick={sellHouse} className="text-xs text-rose-400 hover:text-rose-300">
              Sell current home
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {HOUSING_OPTIONS.map((house) => {
            const isCurrent = character.housing.id === house.id;
            const canAfford = house.price === 0 || character.money >= house.price;
            return (
              <div
                key={house.id}
                className={`rounded-xl border p-3.5 ${
                  isCurrent ? 'border-violet-500 bg-violet-500/10' : 'border-slate-800 bg-slate-800/30'
                }`}
              >
                <div className="text-white font-medium text-sm">{house.name}</div>
                <div className="text-slate-400 text-xs mt-1">
                  {house.price > 0 ? `${formatMoney(house.price)} to buy` : 'Rental'} &middot;{' '}
                  {formatMoney(house.monthlyCost)}/mo &middot; +{house.happinessBonus} happiness
                </div>
                <button
                  onClick={() => buyHouse(house.id)}
                  disabled={isCurrent || !canAfford}
                  className="w-full mt-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold py-2 transition-colors"
                >
                  {isCurrent ? 'Current Home' : house.price > 0 ? 'Buy' : 'Move In'}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Cars</SectionTitle>
          {character.car && (
            <button onClick={sellCar} className="text-xs text-rose-400 hover:text-rose-300">
              Sell current car
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {CAR_OPTIONS.map((car) => {
            const isCurrent = character.car?.id === car.id;
            const canAfford = character.money + (character.car ? character.car.price * 0.65 : 0) >= car.price;
            return (
              <div
                key={car.id}
                className={`rounded-xl border p-3.5 ${
                  isCurrent ? 'border-violet-500 bg-violet-500/10' : 'border-slate-800 bg-slate-800/30'
                }`}
              >
                <div className="text-white font-medium text-sm">{car.name}</div>
                <div className="text-slate-400 text-xs mt-1">
                  {formatMoney(car.price)} &middot; {formatMoney(car.monthlyCost)}/mo &middot; +{car.happinessBonus}{' '}
                  happiness
                </div>
                <button
                  onClick={() => buyCar(car.id)}
                  disabled={isCurrent || !canAfford}
                  className="w-full mt-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold py-2 transition-colors"
                >
                  {isCurrent ? 'Current Car' : 'Buy'}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
