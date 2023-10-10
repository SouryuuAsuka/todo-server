import { IDependency } from '@application/ports/IDependency';
import commentUseCase from '@application/use-cases/comment.use-case';
const commentControllerCreate = (dependencies: IDependency) => {
  const { commentRepository } = dependencies.DatabaseService;
  const {
    getComment,
    createComment,
  } = commentUseCase(commentRepository);
  const getController = async (req: any, res: any, next: any) => {
    try {
      const taskId = req.params?.taskId;
      const data = await getComment(taskId);
      return res.status(200).json({
        status: 'success',
        data
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const createController = async (req: any, res: any, next: any) => {
    try {
      const commentText: string = req.body?.text;
      const rootComment: number | null = req.body?.rootComment ?? null;
      const taskId = req.params?.taskId;
      const userId = res.locals.userId;
      console.log("userId - "+userId)
      if (!commentText) throw new Error('Comments is undefined');
      const data = await createComment(taskId, userId, commentText, rootComment);
      return res.status(200).json({
        status: 'success',
        data,
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  return {
    getController,
    createController,
  }
}

export default commentControllerCreate;