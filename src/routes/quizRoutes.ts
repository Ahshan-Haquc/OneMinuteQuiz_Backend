import { Router } from 'express';
import { getLandingPageData, getTopThreeHighestScores, updateHighestScore, updateTotalPlayCount, updateRating } from '../controllers/quizController';
import { catchAsync } from '../utils/catchAsync';
const router = Router();

router.get('/getLandingPageData', getLandingPageData)
router.get('/getTopThreeHighestScores/:quizName', getTopThreeHighestScores)
router.patch('/updateHighestScore/:quizName', updateHighestScore)
router.patch('/updateTotalPlayCount/:quizName', catchAsync(updateTotalPlayCount))
router.patch('/updateRating/:quizName', catchAsync(updateRating))

export default router;
