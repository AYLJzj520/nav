// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import type { IWebProps, INavProps } from 'src/types'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import event from 'src/utils/mitt'
import { $t } from 'src/locale'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { deleteByIds } from 'src/utils/web'

interface Props {
  ids: number[]
  data?: IWebProps | INavProps
  isClass?: boolean
  onOk?: () => void
  onComplete?: () => void
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzCheckboxModule,
    FormsModule,
  ],
  selector: 'app-delete-modal',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class DeleteModalComponent implements OnChanges {
  @Input() initialDeleteModal: { id: number; props: Props } | null = null
  @Output() ready = new EventEmitter<void>()

  readonly $t = $t

  submitting = false
  showModal = false
  ids: number[] = []
  isClass = false
  data?: IWebProps | INavProps
  isChecked = false
  onOk?: () => void
  onComplete?: () => void

  constructor(private message: NzMessageService) {
    event.on('DELETE_MODAL', (props: unknown) => {
      this.open(props as Props)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialDeleteModal'] && this.initialDeleteModal) {
      this.open(this.initialDeleteModal.props)
    }
  }

  ngOnInit() {
    this.ready.emit()
  }

  private open(props: Props) {
    this.ids = props.ids
    this.isClass = props.isClass || false
    this.data = props.data
    this.showModal = true
    this.onOk = props.onOk
    this.onComplete = props.onComplete
  }

  handleCancel() {
    this.showModal = false
    this.isChecked = false
  }

  async handleOk() {
    let isDelRid = false
    if (this.data?.rId && this.isChecked) {
      isDelRid = true
    }

    const ok = await deleteByIds(this.ids, isDelRid)
    if (ok) {
      this.onOk?.()
      this.message.success($t('_delSuccess'))
    } else {
      this.message.error('Delete failed')
    }

    this.onComplete?.()
    this.handleCancel()
  }
}
