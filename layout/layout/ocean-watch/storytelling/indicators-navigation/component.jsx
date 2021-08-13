// components
import CardIndicator from 'components/card-indicator-set/card-indicator';

export default function IndicatorsNavigation({
  indicators,
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {(indicators || [])
        .map(({ id, title, icon }) => (
          <CardIndicator
            key={id}
            id={id}
            title={title}
            icon={icon}
            // theme={indicatorSetConfiguration?.config?.theme}
          />
        ))}
    </div>
  );
}
