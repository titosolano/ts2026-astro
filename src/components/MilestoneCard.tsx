export interface Milestone {
  title: string
  body: string
  url?: string
  linkLabel?: string
  iconUrl?: string
}

const ExternalLinkSVG = () => (
  <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.001 16H2.00098C1.47054 16 0.961836 15.7893 0.586763 15.4142C0.21169 15.0391 0.000976563 14.5304 0.000976562 14V3C0.000976562 2.46957 0.21169 1.96086 0.586763 1.58579C0.961836 1.21071 1.47054 1 2.00098 1H6.00098V3H2.00098V14H13.001V10H15.001V14C15.001 14.5304 14.7903 15.0391 14.4152 15.4142C14.0401 15.7893 13.5314 16 13.001 16ZM7.70098 9.707L6.29098 8.293L12.584 2H9.00098V0H16.001V7H14.001V3.415L7.70098 9.707V9.707Z" fill="currentcolor" />
  </svg>
)

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
          <a
            href={milestone.url}
            target="_blank"
            rel="noopener noreferrer"
            className="external-button_component"
          >
            <div>{milestone.linkLabel ?? 'More info'}</div>
            <div className="external-button_icon">
              <ExternalLinkSVG />
            </div>
          </a>
        )}
      </div>
    </div>
  )
}
