<script setup lang="ts">
  import { getLessonApply, getTimes, postHandleLessonApply } from '@/apis/lesson';
  import { useCourseStore, type CourseMap } from '@/stores/courseStore';
  import { useTeacherCacheStore } from '@/stores/teacherCacheStore';
  import { computed, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElLink, ElMessage, ElRadioButton, ElRadioGroup, ElTable, ElTableColumn, ElTag, ElTooltip, type FormInstance, type FormRules } from 'element-plus';
  import { Delete, Plus, Refresh } from '@element-plus/icons-vue';
  import { DAY_OF_WEEK_MAP } from '@/utils';
  import WeekRangeSelect from '@/components/WeekRangeSelect.vue';
  import TermSelect from '@/components/TermSelect.vue';
  import { createWs } from '@/ws';
  const teacherCache = useTeacherCacheStore()
  const courseStore = useCourseStore()
  const route = useRoute()
  const router = useRouter()
  let courseMap: CourseMap | null = null

  async function init() {
    courseMap = await courseStore.getCourseMap()
    await getApplies()
    createWs()
  }
  init()

  interface ApplyVO {
    uid: number;
    courseName: string; // 这个课次对应的课程
    targetGrade: number;
    teacherName: string;
  }

  const data = ref<ApplyVO[]>([])

  async function getApplies() {
    const res = await getLessonApply()
    data.value = await Promise.all(res.map(async e => ({
      ...e,
      courseName: courseMap?.get(e.courseId)?.name!,
      teacherName: await teacherCache.get(e.teacherId)
    })))
  }

  // 申请处理
  const curApplyUid = ref('')
  const vis = ref(false)
  function handleOpenDialog(uid: string) {
    vis.value = true
    curApplyUid.value = uid
  }
  /// 时间段添加器
  const statusMapping = ['每周', '单周', '双周'] as const
  interface TimeSeg {
    beginTime: string
    endTime: string
    dayOfWeek?: number
    uuid: number
    status?: number
  }
  let uuid = Number.MAX_SAFE_INTEGER
  const timeSegs = ref<TimeSeg[]>([])
  function addTimeSeg() {
    const copy = timeSegs.value.map(e => ({ ...e }))
    timeSegs.value.unshift({ ...adder.value })
    // 添加事件段，合并问题：
    /// 1.同status，时间段连续合并
    /// 2.不同status，单周与双周有重合：
    /// 2.1 两端对齐：单[0,1,1,0]+双[0,1,1,0]=>每[0,1,1,0]
    /// 2.2 一端对齐：单[0,1,1,0]+双[0,1,1,1]=>每[0,1,1,0]+双[0,0,0,1]
    /// 2.3 两端不对齐：不合并
    let merged = false
    do {
      if (merged) {
        ElMessage({
          message: '发现可以合并的时间段，已自动合并',
          grouping: true,
          type: 'success'
        })
      }
      merged = false
      out:
      for (let i = 0; i < timeSegs.value.length; i++) {
        for (let j = i + 1; j < timeSegs.value.length; j++) {
          const s1 = timeSegs.value[i], s2 = timeSegs.value[j]
          if (s1.dayOfWeek !== s2.dayOfWeek)
            continue
          const { dayOfWeek } = s1
          const begin1 = startTimesMap[s1.beginTime]
          const end1 = endTimesMap[s1.endTime]
          const begin2 = startTimesMap[s2.beginTime]
          const end2 = endTimesMap[s2.endTime]
          if (s1.status === s2.status) {
            if (end2 + 1 === begin1 || end1 + 1 === begin2) { // 情形1
              const nBegin = Math.min(begin2, begin1)
              const nEnd = Math.max(end2, end1)
              timeSegs.value.splice(i, 1)
              timeSegs.value.splice(j - 1, 1)
              timeSegs.value.unshift({
                beginTime: reverseStartTimesMap[nBegin],
                endTime: reverseEndTimesMap[nEnd],
                uuid: --uuid,
                dayOfWeek,
                status: s1.status
              })
              merged = true
              break out
            }
          } else if (s1.status !== 0 && s2.status !== 0) { // 情形2
            if (begin1 === begin2 && end1 === end2) { // 情形2.1
              timeSegs.value.splice(i, 1)
              timeSegs.value.splice(j - 1, 1)
              timeSegs.value.unshift({
                beginTime: reverseStartTimesMap[begin1],
                endTime: reverseEndTimesMap[end1],
                uuid: --uuid,
                dayOfWeek,
                status: 0
              })
              merged = true
              break out
            } else if (begin1 === begin2) {// 情形2.2(1)
              // 8:30(1)-10:10(2) 8:30(1)-12:10(4)
              // 8:30(1)-10:10(2) 10:30(3)-12:10(4)
              timeSegs.value.splice(i, 1)
              timeSegs.value.splice(j - 1, 1)
              const minEnd = Math.min(end2, end1)
              const maxEnd = Math.max(end2, end1)
              timeSegs.value.unshift({
                beginTime: reverseStartTimesMap[begin1],
                endTime: reverseEndTimesMap[minEnd],
                uuid: --uuid,
                dayOfWeek,
                status: 0
              })
              timeSegs.value.unshift({
                beginTime: reverseStartTimesMap[minEnd + 1],
                endTime: reverseEndTimesMap[maxEnd],
                uuid: --uuid,
                dayOfWeek,
                status: end1 > end2 ? s1.status : s2.status
              })
              merged = true
              break out
            } else if (end1 === end2) {// 情形2.2(2)
              // 8:30(1)-12:10(4) 10:30(3)-12:10(4)
              // 8:30(1)-10:10(2) 10:30(3)-12:10(4)
              timeSegs.value.splice(i, 1)
              timeSegs.value.splice(j - 1, 1)
              const minBegin = Math.min(begin2, begin1)
              const maxBegin = Math.max(begin2, begin1)
              timeSegs.value.unshift({
                beginTime: reverseStartTimesMap[maxBegin],
                endTime: reverseEndTimesMap[end1],
                uuid: --uuid,
                dayOfWeek,
                status: 0
              })
              timeSegs.value.unshift({
                beginTime: reverseStartTimesMap[minBegin],
                endTime: reverseEndTimesMap[maxBegin - 1],
                uuid: --uuid,
                dayOfWeek,
                status: begin1 < begin2 ? s1.status : s2.status
              })
              merged = true
              break out
            }
          }
        }
      }
    } while (merged)
    if (timeSegs.value.length > 3) {
      timeSegs.value = copy
      ElMessage.error('最多安排3个时间段!')
    }
    clearAll(true)
  }
  function clearAdder() {
    adder.value = {
      beginTime: '',
      endTime: '',
      dayOfWeek: void 0,
      uuid: 0,
      status: void 0
    }
  }
  const adder = ref<TimeSeg>({
    beginTime: '',
    endTime: '',
    dayOfWeek: void 0,
    uuid: 0,
    status: void 0
  })
  const adderFull = computed(() => !!adder.value.beginTime && !!adder.value.endTime && adder.value.dayOfWeek !== void 0)
  /// 时间段选择器
  const startTimesMap: { [key: string]: number } = {
    "08:30:00": 1,
    "09:25:00": 2,
    "10:30:00": 3,
    "11:25:00": 4,
    "14:00:00": 5,
    "14:55:00": 6,
    "15:50:00": 7,
    "16:45:00": 8,
    "18:30:00": 9,
    "19:25:00": 10,
    "20:20:00": 11
  }
  // 4-6 1-6 => 1-2 3-4
  const endTimesMap: { [key: string]: number } = {
    "09:15:00": 1,
    "10:10:00": 2,
    "11:15:00": 3,
    "12:10:00": 4,
    "14:45:00": 5,
    "15:40:00": 6,
    "16:35:00": 7,
    "17:30:00": 8,
    "19:15:00": 9,
    "20:10:00": 10,
    "21:05:00": 11
  }
  const reverseStartTimesMap: { [key: number]: string } = {
    1: "08:30:00",
    2: "09:25:00",
    3: "10:30:00",
    4: "11:25:00",
    5: "14:00:00",
    6: "14:55:00",
    7: "15:50:00",
    8: "16:45:00",
    9: "18:30:00",
    10: "19:25:00",
    11: "20:20:00"
  };

  const reverseEndTimesMap: { [key: number]: string } = {
    1: "09:15:00",
    2: "10:10:00",
    3: "11:15:00",
    4: "12:10:00",
    5: "14:45:00",
    6: "15:40:00",
    7: "16:35:00",
    8: "17:30:00",
    9: "19:15:00",
    10: "20:10:00",
    11: "21:05:00"
  };
  // 1为默认，2为禁止（红色），3为警告（黄色），4为已选择，5为选择中，负数为禁止选择（但不是红色）

  const classMap = ['', '', 'ban', 'warn', 'choosed', 'choosing']
  const getPos = (elem: HTMLTableCellElement): [number, number] => [+elem.dataset.row!, +elem.dataset.col!]
  let firstChoose: [number, number] | null = null
  function handleMouseenter({ target }: MouseEvent) {
    if (!(target instanceof HTMLTableCellElement) || !target.classList.contains('selector'))
      return
    if (firstChoose) {
      const [x, y] = getPos(target)
      if (y !== firstChoose[1])
        return
      const s = firstChoose[0]
      for (let i = s; i <= 11; i++) {
        if (mat.value[i][y] < 0)
          break
        mat.value[i][y] = origin[i][y]
      }
      requestAnimationFrame(() => {
        for (let i = s; i <= x; i++) {
          mat.value[i][y] = 5
        }
      })
    }
  }
  function handleRClick() {
    if (firstChoose) {
      firstChoose = null
      mat.value = origin.map(e => [...e])
      ElMessage({
        message: '已取消',
        grouping: true,
        type: 'success'
      })
    }
  }
  function handleClick({ target }: MouseEvent) {
    if (!(target instanceof HTMLTableCellElement) || !target.classList.contains('selector'))
      return
    if (!firstChoose) {
      firstChoose = getPos(target)
      mat.value[firstChoose[0]][firstChoose[1]] = 5
      ElMessage({
        message: '已选择起始时间，再选一个以完成时间段选择（或右键重选起点）',
        grouping: true,
        type: 'success'
      })
      for (let j = 1; j <= 7; j++) {
        let flag = false
        for (let i = 1; i <= 11; i++) {
          if (j !== firstChoose[1]) {
            mat.value[i][j] = -Math.abs(mat.value[i][j])
          } else {
            if (i < firstChoose[0]) {
              mat.value[i][j] = -Math.abs(mat.value[i][j])
            } else if (i > firstChoose[0]) {
              if (mat.value[i][j] === 2 || flag) {
                mat.value[i][j] = -Math.abs(mat.value[i][j])
                flag = true
              }
            }
          }
        }
      }
    } else {
      const [x, y] = getPos(target)
      const s = firstChoose[0]
      for (let i = s; i <= x; i++) {
        mat.value[i][y] = -4
      }
      for (let i = x + 1; i <= 11; i++) {
        mat.value[i][y] = -Math.abs(mat.value[i][y])
      }
      adder.value.beginTime = reverseStartTimesMap[s]
      adder.value.endTime = reverseEndTimesMap[x]
      adder.value.dayOfWeek = y
      adder.value.uuid = --uuid
    }
  }
  let origin: number[][] = []
  const mat = ref([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ])
  async function getAvailTimeSegs(v: any) {
    v = v as number
    const res = await getTimes({ uid: curApplyUid.value, status: v })
    for (const e of res.notRequired) {
      const start = startTimesMap[e.beginTime]
      const end = endTimesMap[e.endTime]
      const { dayOfWeek } = e
      for (let i = start; i <= end; i++) {
        mat.value[i][dayOfWeek] = 3
      }
    }
    for (const e of res.ban) {
      const start = startTimesMap[e.beginTime]
      const end = endTimesMap[e.endTime]
      const { dayOfWeek } = e
      for (let i = start; i <= end; i++) {
        mat.value[i][dayOfWeek] = 2
      }
    }
    for (const e of timeSegs.value) {
      if (v === 0 || e.status === 0 || e.status === v) {
        const start = startTimesMap[e.beginTime]
        const end = endTimesMap[e.endTime]
        const { dayOfWeek } = e
        for (let i = start; i <= end; i++) {
          mat.value[i][dayOfWeek!] = 2
        }
      }
    }
    origin = mat.value.map(e => [...e])
  }
  /// 周区间与学期选择器(表单)
  const dialogFormRef = ref<FormInstance>()
  interface DialogForm {
    weekRange: [number, number]
    term: string
    capacity: string
  }
  const dialogFormVal = ref<DialogForm>({
    weekRange: [0, 0],
    term: '',
    capacity: ''
  })
  const dialogFormRules: FormRules<DialogForm> = {
    weekRange: [
      { required: true, message: '请选择起始周与结束周', trigger: ['blur', 'change'] },
      {
        validator(_, [s, e]: [number, number], cb) {
          if (s > e)
            cb(new Error('起始周不能大于结束周'))
          else if (s < 1 || s > 30 || e < 1 || e > 30)
            cb(new Error('周数必须在1-30之间'))
          else
            cb()
        }
      }
    ],
    term: [{ required: true, message: '请选择学期', trigger: ['blur', 'change'] }],
    capacity: [
      { required: true, message: '请输入课容量', trigger: ['blur', 'change'] },
      {
        validator(_, v, cb) {
          if (Number.isNaN(v) || +v < 1)
            cb(new Error('容量应为正整数'))
          else
            cb()
        }
      }
    ],
  }
  async function handleSubmit() {
    if (!timeSegs.value.length) {
      ElMessage({
        message: '请添加至少一个时间段',
        type: 'error',
        grouping: true
      })
      return
    }
    const valid = await dialogFormRef.value?.validate()
    if (!valid)
      return
    const obj = {
      uid: curApplyUid.value,
      startWeek: dialogFormVal.value.weekRange[0],
      endWeek: dialogFormVal.value.weekRange[1],
      capacity: +dialogFormVal.value.capacity,
      term: dialogFormVal.value.term,
      time: timeSegs.value as Required<TimeSeg>[]
    }
    await postHandleLessonApply(obj)
    ElMessage.success('处理成功!')
    clearAll()
    vis.value = false
    refreshApplies()
  }
  // 清除所有数据
  function clearAll(clearPart: boolean = false) {
    if (!clearPart) {
      dialogFormRef.value?.resetFields()
      dialogFormVal.value.term = ''
      dialogFormVal.value.weekRange = [0, 0]
      timeSegs.value = []
    }
    mat.value.forEach(e => e.fill(1))
    firstChoose = null
    clearAdder()
  }
  // 其它处理
  function refreshApplies() {
    router.push({ query: { t: Date.now() } })
  }
  watch(() => route.query, () => getApplies())
</script>

<template>
  <div class="lesson-container">
    <header>
      <ElButton @click="refreshApplies" :icon="Refresh" circle />
    </header>
    <ElTable :data stripe class="table">
      <ElTableColumn fixed label="课程名称" prop="courseName" />
      <ElTableColumn label="面向年级" prop="targetGrade" />
      <ElTableColumn label="申请教师" prop="teacherName" />
      <ElTableColumn fixed="right" label="操作" width="80">
        <template #default="scope">
          <ElLink type="primary" @click="handleOpenDialog(scope.row.uid)">处理</ElLink>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
  <ElDialog @close="clearAll" :z-index="9998" fullscreen v-model="vis">
    <div class="dialog">
      <div class="left">
        <div class="time-unit-add">
          <ElTooltip popper-class="above-dialog-tooltip" content="选择一项,以在右侧选择时间段" placement="right">
            <ElRadioGroup :disabled="adder.status !== void 0" @change="getAvailTimeSegs" size="large"
              v-model="adder.status">
              <ElRadioButton label="每周" :value="0" />
              <ElRadioButton label="单周" :value="1" />
              <ElRadioButton label="双周" :value="2" />
            </ElRadioGroup>
          </ElTooltip>
          <div class="ops">
            <ElTooltip popper-class="above-dialog-tooltip" content="重新选择单双周">
              <ElButton :disabled="adder.status === void 0 || adderFull" @click="clearAll(true)" type="primary" circle
                :icon="Refresh" />
            </ElTooltip>
            <ElTooltip placement="top" popper-class="above-dialog-tooltip" content="舍弃待添加时间段">
              <ElButton :disabled="!adderFull" @click="clearAll(true)" type="danger" circle :icon="Delete" />
            </ElTooltip>
            <ElTooltip placement="top" popper-class="above-dialog-tooltip" content="确认添加该时间段">
              <ElButton :disabled="!adderFull" @click="addTimeSeg" type="success" circle :icon="Plus" />
            </ElTooltip>
          </div>
          <div v-if="adderFull" class="waiting">
            <ElTag size="large" round>{{ statusMapping[adder.status!] }}</ElTag>
            <ElTag size="large" effect="dark" round>{{ DAY_OF_WEEK_MAP[adder.dayOfWeek!] }}</ElTag>
            <span>{{ adder.beginTime }}</span>~<span>{{ adder.endTime }}</span>
          </div>
        </div>
        <ul class="time-unit-display">
          <li v-for="t in timeSegs" :key="t.uuid">
            <ElTag size="large" round>{{ statusMapping[t.status!] }}</ElTag>
            <ElTag size="large" effect="dark" round>{{ DAY_OF_WEEK_MAP[t.dayOfWeek!] }}</ElTag>
            <span>{{ t.beginTime }}</span>~<span>{{ t.endTime }}</span>
          </li>
          <li v-if="!timeSegs.length" style="color: #aaa;text-align: center;width: 100%;">暂无时间段</li>
        </ul>
        <div class="week-selector">
          <ElForm @submit.prevent="handleSubmit" ref="dialogFormRef" :model="dialogFormVal" :rules="dialogFormRules">
            <ElFormItem prop="weekRange">
              <WeekRangeSelect v-model="dialogFormVal.weekRange" />
            </ElFormItem>
            <ElFormItem prop="term">
              <TermSelect :prefix="20" v-model="dialogFormVal.term" />
            </ElFormItem>
            <ElFormItem label="课容量" prop="capacity">
              <ElInput type="number" v-model="dialogFormVal.capacity" />
            </ElFormItem>
            <ElFormItem label=" ">
              <ElButton native-type="submit" type="primary" :icon="Plus">确认添加该课次</ElButton>
            </ElFormItem>
          </ElForm>
        </div>
      </div>
      <div class="table-container">
        <table @click="handleClick" @contextmenu.prevent="handleRClick" @mouseenter.capture="handleMouseenter"
          class="time-table" border="1">
          <thead>
            <tr>
              <th>节次</th>
              <th>周一</th>
              <th>周二</th>
              <th>周三</th>
              <th>周四</th>
              <th>周五</th>
              <th>周六</th>
              <th>周日</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 11">
              <td>{{ i }}</td>
              <td class="selector" :class="{ [classMap[Math.abs(mat[i][j])]]: true, 'not-allowed': mat[i][j] < 0 }"
                v-for="j in 7" :data-row="i" :data-col="j"></td>
            </tr>
          </tbody>
        </table>
        <div v-if="adder.status === void 0" class="mask"></div>
      </div>
    </div>
  </ElDialog>
</template>

<style lang="less" scoped>
  .lesson-container {
    width: 100%;
    height: 100%;

    header {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 75px;
      padding: 20px;
      width: 100%;
      border-bottom: 1px solid #dcdfe6;
    }

    .table {
      height: calc(100vh - 75px);
    }
  }

  .dialog {
    display: flex;
    justify-content: space-around;
    height: 100%;
    width: 100%;

    .left {
      width: 25vw;

      .time-unit-display {
        list-style: none;
        padding: 0;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #bbb;
        border-radius: 5px;

        li {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:last-child {
            margin-bottom: 0;
          }
        }

        // TODO 待添加角标
        // &::after {
        //   content: '添加时间段';
        //   right: -12%;
        //   top: -14%;
        //   height: fit-content;
        //   width: fit-content;
        //   padding: 2px;
        //   font-size: 10px;
        //   color: #fff;
        //   border-radius: 5px;
        //   background-color: #67C23A;
        //   position: absolute;
        // }
      }

      .time-unit-add {
        padding: 10px;
        border: 1px solid #bbb;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .ops {
          margin-top: 10px;
          padding: 10px;

        }

        .waiting {
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #67C23A;
          border-radius: 5px;
          position: relative;

          &::after {
            content: '待添加';
            right: -12%;
            top: -14%;
            height: fit-content;
            width: fit-content;
            padding: 2px;
            font-size: 10px;
            color: #fff;
            border-radius: 5px;
            background-color: #67C23A;
            position: absolute;
          }
        }
      }

      .week-selector {
        padding: 10px;
        border: 1px solid #bbb;
        border-radius: 5px;

        .small-form-item {
          width: 6.5vw;
        }

        .smaller-form-item {
          width: 4.5vw;
        }
      }
    }

    .table-container {
      width: 50vw;
      height: 500px;
      position: relative;

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .2);
        cursor: not-allowed;
      }

      .time-table {
        height: 100%;
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #bbb;

        td.selector {
          cursor: pointer;
          transition: .3s;
          background-color: #eee;

          &:hover {
            filter: brightness(1.06)
          }

          &.ban {
            background-color: #F56C6C;
            pointer-events: none;
            position: relative;

            &:hover {
              filter: none;
            }
          }

          &.not-allowed {
            pointer-events: none;
            filter: brightness(.88);

            &:hover {
              filter: brightness(.88);
            }
          }

          &.warn {
            background-color: rgb(237.5, 189.9, 118.5);
          }

          &.choosing {
            @keyframes blink {
              0% {
                background-color: rgb(121.3, 187.1, 255);
              }

              50% {
                background-color: rgb(197.7, 225.9, 255);
              }

              100% {
                background-color: rgb(121.3, 187.1, 255);
              }
            }

            animation: blink 1.2s infinite ease-in-out;
          }

          &.choosed {
            background-color: #409EFF;
          }
        }
      }
    }
  }

</style>
