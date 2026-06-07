import ButtonArrow from './ButtonArrow'
import ExternalButton from './ExternalButton'

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
  standalone?: boolean
}


export default function ProjectCard({ project, standalone = false }: Props) {
  const anim = standalone ? 'blur-fade' : 'slide-blur'
  const Title = standalone ? 'h1' : 'h3'

  return (
    <div className="use-case-template_component">
    <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-small">

            <div className="use-case-template_top-wrapper">
              {/* Left: text content */}
              <div className="use-case-template_top-left-content">
                <div className="use-case-template_heading-wrapper"
                  data-anim={anim}
                  data-anim-delay="0.1"
                >
                  <div className="heading-tag_component">
                    <div className="heading-tag_wrapper">
                      <img loading="lazy" src="/images/dots-icon.svg" alt="" className="heading-tag_icon" />
                      <div className="text-color-green">Featured project</div>
                    </div>
                  </div>

                  <div className="spacer-small" />
                  <div className="max-width-medium">
                    <Title className="heading-style-h3 text-style-balance">{project.title}</Title>
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
                      <div className={standalone ? 'spacer-small' : 'spacer-medium'}>
                        <div className="button-group is-gap-medium">
                          {!standalone && <ButtonArrow href={`/case-studies/${project.slug}`} label="Case study" cta="case_study" ctaLocation="work" ctaContext="project_card" />}
                          <ExternalButton href={project.url} label="Visit website" cta="visit_website" ctaLocation="work" ctaContext="project_card" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata: industry / year / role */}
                <div className="use-case-template_features-list"
                  data-anim={anim}
                  data-anim-delay="0.2"
                >
                  {project.industry && (
                    <div className="use-case-template_feature-item">
                      <div className="use-case-template_items">
                        <h3 className="heading-style-label">Industry</h3>
                        <div className="spacer-xsmall" />
                        <div>{project.industry}</div>
                      </div>
                    </div>
                  )}
                  {project.year && (
                    <div className="use-case-template_feature-item">
                      <div className="use-case-template_items">
                        <h3 className="heading-style-label">Year</h3>
                        <div className="spacer-xsmall" />
                        <div>{project.year}</div>
                      </div>
                    </div>
                  )}
                  {project.role && (
                    <div className="use-case-template_feature-item is-last">
                      <div className="use-case-template_items">
                        <h3 className="heading-style-label">My Role</h3>
                        <div className="spacer-xsmall" />
                        <div>{project.role}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: cover image */}
              <div className="use-case-template_top-right-left-content"
                data-anim={anim}
                data-anim-delay="0.05"
              >
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
                <div className="use-case-template_detail-list"
                  data-anim={anim}
                  data-anim-delay="0.3"
                >
                  {project.challenge && (
                    <div className="use-case-template_detail-item">
                      <div className="use-case-template_items">
                        <h3 className="heading-style-label">The Challenge</h3>
                        <div className="spacer-xsmall" />
                        <p>{project.challenge}</p>
                      </div>
                    </div>
                  )}
                  {project.approach && (
                    <div className="use-case-template_detail-item">
                      <div className="use-case-template_items">
                        <h3 className="heading-style-label">Approach &amp; Solution</h3>
                        <div className="spacer-xsmall" />
                        <p>{project.approach}</p>
                      </div>
                    </div>
                  )}
                  {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <div className="use-case-template_detail-item">
                      <div className="use-case-template_items">
                        <h3 className="heading-style-label">Key Features</h3>
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
