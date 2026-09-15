import {client, fetchOpts} from './sanity'

const media = `{image, alt, videoUrl, isVideoPlaceholder, caption}`
const stat = `{value, label}`
const refCard = `{_type, "slug": slug.current, name, role, summary, image, category, family, status, stats[]${stat}}`

export const settingsQuery = `*[_type=="siteSettings"][0]{name, tagline, description, nav[]{label, href}, email, phone, address, footerNote, ctaLabel}`
export const pageQuery = `*[_type=="page" && slug.current==$slug][0]{
  title, metaDescription, heroEyebrow, heroTitle, heroLead, heroMedia${media}, heroCtaLabel, heroCtaHref,
  sections[]{kind, eyebrow, title, lead, body, reverse, ctaLabel, ctaHref, media${media}, stats[]${stat},
    features[]{title, text, href, image}, refs[]->${refCard}}
}`
export const platformsQuery = `*[_type=="platform"] | order(order asc) ${refCard}`
export const platformQuery = `*[_type=="platform" && slug.current==$slug][0]{..., "slug": slug.current, stats[]${stat}, specs[]{label, value}, applications[]->${refCard}}`
export const applicationsQuery = `*[_type=="application"] | order(order asc) ${refCard}`
export const applicationQuery = `*[_type=="application" && slug.current==$slug][0]{..., "slug": slug.current, stats[]${stat}, media${media}, platforms[]->${refCard}}`
export const offeringsQuery = `*[_type=="offering" && category==$category] | order(order asc) {..., "slug": slug.current}`
export const slugsQuery = (type: string) => `*[_type=="${type}" && defined(slug.current)].slug.current`

export const getSettings = () => client.fetch(settingsQuery, {}, fetchOpts)
export const getPage = (slug: string) => client.fetch(pageQuery, {slug}, fetchOpts)
export const getPlatforms = () => client.fetch(platformsQuery, {}, fetchOpts)
export const getPlatform = (slug: string) => client.fetch(platformQuery, {slug}, fetchOpts)
export const getApplications = () => client.fetch(applicationsQuery, {}, fetchOpts)
export const getApplication = (slug: string) => client.fetch(applicationQuery, {slug}, fetchOpts)
export const getOfferings = (category: string) => client.fetch(offeringsQuery, {category}, fetchOpts)
export const getSlugs = (type: string): Promise<string[]> => client.fetch(slugsQuery(type), {}, fetchOpts)
