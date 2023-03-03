const csharp = {
  starter: `namespace program;
public class Solution
{
    public static bool Solve()
    {
        // Your code here
        return true;
    }
}`,
  test: `using NUnit.Framework;

namespace program;

[TestFixture]
public class UnitTests
{
    private Solution _solution;

    [SetUp]
    public void SetUp()
    {
        _solution = new Solution();
    }

    [Test]
    public void ExampleTest_IsTrue()
    {
        var result = Solution.Solve();
        
        Assert.AreEqual(true, result);
    }
}`,
};

const js = {
  test: `import { it, expect } from "bun:test"
import solve from ".";

it("Returns true", () => {
  expect(solve()).toBe(true);
});`,
  starter: `function solve(args) {
  return true;
}`,
};

const ts = {
  test: `import { it, expect } from "bun:test"
import solve from ".";

it("Returns true", () => {
  expect(solve()).toBe(true);
});`,
  starter: `function solve(args) {
  return true;
}`,
};

const py = {
  test: `import unittest
import matplotlib_mocks
from implementation import solve
  
class TestMethods(unittest.TestCase):
  def test_solve_is_true(self):
    self.assertEqual(True, solve())
  
if __name__ == "__main__":
  unittest.main(failfast=True, exit=False)
`,
starter: `import matplotlib.pyplot as plt
import numpy as np

def solve():
  return True`
}

function getCodeForLanguage(lang: string) {
  if (lang === "C#") return csharp;
  if (lang === "JavaScript") return js;
  if (lang === "TypeScript") return ts;
  if (lang === "Python") return py;
  return { starter: "", test: "" };
}

export default getCodeForLanguage;
