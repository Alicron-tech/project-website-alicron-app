import {locale} from './locale'
import {siteSettings} from './siteSettings'
import {page} from './page'
import {platform} from './platform'
import {application} from './application'
import {offering} from './offering'
import {media, stat, feature, section} from './blocks'

export const schemaTypes = [...locale, media, stat, feature, section, siteSettings, page, platform, application, offering]
