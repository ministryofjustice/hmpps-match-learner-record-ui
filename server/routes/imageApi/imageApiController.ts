import { Request, RequestHandler, Response } from 'express'
import path from 'path'
import PrisonApiService from '../../services/prisonApi/prisonApiService'
import AuditService from '../../services/auditService'

export default class ImageApiController {
  public constructor(
    private readonly auditService: AuditService,
    private readonly prisonApiService: PrisonApiService,
  ) {}

  public prisonerImage: RequestHandler = (req: Request, res: Response) => {
    const { imageId } = req.params
    if (imageId === 'placeholder') {
      res.sendFile(path.join(__dirname, '../../../assets/images/', 'prisoner-profile-image.png'))
    } else {
      this.prisonApiService
        .getImage(imageId, 'default-username')
        .then(data => {
          res.set('Cache-control', 'private, max-age=86400')
          res.removeHeader('pragma')
          res.type('image/jpeg')
          data.pipe(res)
        })
        .catch(_error => {
          res.sendFile(path.join(__dirname, '../../../assets/images/', 'prisoner-profile-image.png'))
        })
    }
  }
}
