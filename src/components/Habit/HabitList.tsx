import { Habit } from '@/types';
import { getHabitFrequencyString } from '@/utils/entityHelpers';
import { formatDateString } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { Dispatch, useState } from 'react';
import CustomTable, { CELL_TYPE } from '../common/CustomTable';
import LogModal from './LogModal';
import { LargeHeading } from '../common/Typography';

function HabitTableBody({ habits, setActiveHabit }: { habits: Habit[], setActiveHabit: Dispatch<Habit> }) {
  const router = useRouter();

  return <>
    <CustomTable
      rows={habits.map((habit, idx) => ({
        cells: [
          { kind: CELL_TYPE.TEXT, widthPercent: 2, text: (idx + 1).toString(), additionalProps: {} },
          { kind: CELL_TYPE.TEXT_WITH_SUBTEXT, widthPercent: 60, text: habit.title, additionalProps: { subText: habit.desc } },
          { kind: CELL_TYPE.TEXT, widthPercent: 16, text: getHabitFrequencyString(habit), additionalProps: {} },
          { kind: CELL_TYPE.TEXT, widthPercent: 16, text: formatDateString(habit.CreatedAt), additionalProps: {} },
          {
            kind: CELL_TYPE.BUTTON, widthPercent: 6, text: 'Log', additionalProps: {
              onClick: () => {
                (document.getElementById('my_modal_1') as HTMLDialogElement).showModal();
                setActiveHabit(habit);
              }
            }
          },
        ],
        onClick: () => {
          router.push(`/habit/logs/${habit.ID}`)
        },
      }))}
    />
  </>
}

const HabitList = ({ habits }: { habits: Habit[] }) => {
  const [activeHabit, setActiveHabit] = useState<Habit | undefined>();
  const [showAntiHabits, setShowAntiHabits] = useState(false); // TODO: initialize based on local storage
  // TODO: add option to show archived habits
  return (
    <div className="overflow-x-auto">
      <LargeHeading text='Active Habits' /> {/* TODO: Add icon to create form at right of here OR to show archived habits */}
      <LogModal habit={activeHabit} />
      <HabitTableBody habits={habits.filter(habit => !habit.anti)} setActiveHabit={setActiveHabit} />
      <div className="text-center mt-4">
        <button className="btn" onClick={() => setShowAntiHabits(!showAntiHabits)}>
          {showAntiHabits ? 'Hide' : 'Show'} Anti-Habits
        </button>
      </div>
      {showAntiHabits && <HabitTableBody habits={habits.filter(habit => habit.anti)} setActiveHabit={setActiveHabit} />}
    </div>
  );
};

export default HabitList;