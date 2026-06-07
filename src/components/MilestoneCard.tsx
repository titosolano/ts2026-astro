import ExternalButton from './ExternalButton'

export interface Milestone {
  title: string
  body: string
  url?: string
  linkLabel?: string
  iconUrl?: string
}

export default function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <div className="news_item">
      <div className="news_item-icon-wrapper">
        <img
          loading="lazy"
          src={milestone.iconUrl ?? '/images/trophy-1.svg'}
          alt=""
          className="news_icon"
        />
      </div>
      <div className="news_item-content-wrapper">
        <h3 className="heading-cards">{milestone.title}</h3>
        <p className="text-size-small text-style-muted">{milestone.body}</p>
        {milestone.url && (
          <ExternalButton href={milestone.url} label={milestone.linkLabel ?? 'Learn more'} />
        )}
      </div>
    </div>
  )
}
