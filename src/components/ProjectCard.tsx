export interface Project {
  title: string
  slug: string
  description: string
  credit?: string
  url?: string
  industry?: string
  year?: number
  role?: string
  challenge?: string
  approach?: string
  keyFeatures?: string[]
  coverImage?: string
  coverImageAlt?: string
  featured?: boolean
}

interface Props {
  project: Project
}

const ExternalIcon = () => (
  <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13.001 16H2.00098C1.47054 16 0.961836 15.7893 0.586763 15.4142C0.21169 15.0391 0.000976563 14.5304 0.000976562 14V3C0.000976562 2.46957 0.21169 1.96086 0.586763 1.58579C0.961836 1.21071 1.47054 1 2.00098 1H6.00098V3H2.00098V14H13.001V10H15.001V14C15.001 14.5304 14.7903 15.0391 14.4152 15.4142C14.0401 15.7893 13.5314 16 13.001 16ZM7.70098 9.707L6.29098 8.293L12.584 2H9.00098V0H16.001V7H14.001V3.415L7.70098 9.707V9.707Z" fill="currentColor" />
  </svg>
)

export default function ProjectCard({ project }: Props) {
  return (
    <div className="use-case-template_component">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-small">

            <div className="use-case-template_top-wrapper">
              {/* Left: text content */}
              <div className="use-case-template_top-left-content">
                <div className="use-case-template_heading-wrapper">
                  {project.featured && (
                    <div className="heading-tag_component">
                      <div className="heading-tag_wrapper">
                        <img loading="lazy" src="/images/dots-icon.svg" alt="" className="heading-tag_icon" />
                        <div className="text-color-green">Featured project</div>
                      </div>
                    </div>
                  )}

                  <div className="spacer-small" />
                  <div className="max-width-medium">
                    <h3 className="heading-style-h3 text-style-balance">{project.title}</h3>
                  </div>
                  <div className="spacer-small" />

                  <div className="max-width-medium">
                    <p>{project.description}</p>
                    {project.credit && (
                      <div className="spacer-small">
                        <p className="text-size-small text-style-muted">{project.credit}</p>
                      </div>
                    )}
                    {project.url && (
                      <div className="spacer-small">
                        <div className="button-group">
                          <a
                            rel="noopener noreferrer"
                            href={project.url}
                            target="_blank"
                            className="external-button_component"
                          >
                            <div>Visit website</div>
                            <div className="external-button_icon"><ExternalIcon /></div>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata: industry / year / role */}
                <div className="use-case-template_features-list">
                  {project.industry && (
                    <div className="use-case-template_feature-item">
                      <div className="use-case-template_items">
                        <h3 className="use-case-template_label">Industry</h3>
                        <div className="spacer-xsmall" />
                        <div>{project.industry}</div>
                      </div>
                    </div>
                  )}
                  {project.year && (
                    <div className="use-case-template_feature-item">
                      <div className="use-case-template_items">
                        <h3 className="use-case-template_label">Year</h3>
                        <div className="spacer-xsmall" />
                        <div>{project.year}</div>
                      </div>
                    </div>
                  )}
                  {project.role && (
                    <div className="use-case-template_feature-item is-last">
                      <div className="use-case-template_items">
                        <h3 className="use-case-template_label">My Role</h3>
                        <div className="spacer-xsmall" />
                        <div>{project.role}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: cover image */}
              <div className="use-case-template_top-right-left-content">
                <div className="use-case-template_image-wrapper">
                  {project.coverImage && (
                    <img
                      src={project.coverImage}
                      loading="lazy"
                      alt={project.coverImageAlt ?? project.title}
                      className="image-absolute"
                    />
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Detail section: challenge / approach / key features */}
          {(project.challenge || project.approach || (project.keyFeatures?.length ?? 0) > 0) && (
            <div className="use-case-template_mid-content">
              <div className="padding-section-small">
                <div className="use-case-template_detail-list">
                  {project.challenge && (
                    <div className="use-case-template_detail-item">
                      <div className="use-case-template_items">
                        <h3 className="use-case-template_label">The Challenge</h3>
                        <div className="spacer-xsmall" />
                        <p>{project.challenge}</p>
                      </div>
                    </div>
                  )}
                  {project.approach && (
                    <div className="use-case-template_detail-item">
                      <div className="use-case-template_items">
                        <h3 className="use-case-template_label">Approach &amp; Solution</h3>
                        <div className="spacer-xsmall" />
                        <p>{project.approach}</p>
                      </div>
                    </div>
                  )}
                  {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <div className="use-case-template_detail-item">
                      <div className="use-case-template_items">
                        <h3 className="use-case-template_label">Key Features</h3>
                        <div className="spacer-xsmall" />
                        <ul className="dots-list-text" role="list">
                          {project.keyFeatures.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
