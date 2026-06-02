import { NextFunction, Request, Response } from "express";

export const getLandingPageData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ status: 'success', message: 'Landing page data retrieved successfully.' });
    } catch (error) {
        next(error);
    }
}

export const getTopThreeHighestScores = async (req: Request, res: Response) => {
    // const { quizName } = req.params;
    // if(!quizName){
    //     throw new ApiError(400, 'Quiz name is required.');
    // }
    // const topScores = await Quiz.find({ quizName }).sort({ score: -1 }).limit(3);
    // res.status(200).json({ status: 'success', data: { topScores } });
}

export const updateHighestScore = async (req: Request, res: Response) => {
    // const { quizName } = req.params;
    // if(!quizName){
    //     throw new ApiError(400, 'Quiz name is required.');
    // }
    // const topScores = await Quiz.find({ quizName }).sort({ score: -1 }).limit(3);
    // res.status(200).json({ status: 'success', data: { topScores } });
}

export const updateTotalPlayCount = async (req: Request, res: Response) => {
    // const { quizName } = req.params;
    // if(!quizName){
    //     throw new ApiError(400, 'Quiz name is required.');
    // }
    // const topScores = await Quiz.find({ quizName }).sort({ score: -1 }).limit(3);
    // res.status(200).json({ status: 'success', data: { topScores } });
}