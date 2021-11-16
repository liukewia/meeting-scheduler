package com.uofg.timescheduler.util;

import java.util.ArrayList;
import java.util.List;

public class SwapPermute {

    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<List<Integer>>();
        arrange(nums, 0, nums.length - 1, res);
        return res;
    }

    // 邻里互换法
    // https://zhuanlan.zhihu.com/p/356586210
    private void arrange(int[] nums, int start, int end, List<List<Integer>> res) {
        if (start == end)//到最后一个 添加到结果中
        {
            List<Integer> tmp = new ArrayList<Integer>();
            for (int a : nums) {
                tmp.add(a);
            }
            res.add(tmp);
        }
        for (int i = start; i <= end; i++)//未确定部分开始交换
        {
            swap(nums, i, start);
            arrange(nums, start + 1, end, res);
            swap(nums, i, start);//还原
        }
    }

    private void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
}
