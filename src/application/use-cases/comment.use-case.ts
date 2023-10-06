import { ICommentRepository } from "@application/ports/repository";
import { Task } from "@domain/interfaces";

const commentUseCase = (commentRepository: ICommentRepository) => {

  const createComment = async (taskId: number, userId: number, text: string, rootComment: number | null) => {
    const comment = await commentRepository.create(taskId, userId, text, rootComment);
    return { comment }
  }
  const getComment = async (taskId: number) => {
    const comments = await commentRepository.get(taskId);
    return { comments }
  }
  return {
    createComment,
    getComment,
  }
}

export default commentUseCase;