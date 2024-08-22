import os

# 定义文件结构
file_structure = {
    "algebra": [
        "equation.html",
        "quadratic-equation.html",
        "inequalities.html",
        "complex-numbers.html",
        "sequences.html"
    ],
    "function": [
        "monotone.html",
        "period.html",
        "image-definition.html",
        "inverse-functions.html",
        "exponential-functions.html",
        "logarithmic-functions.html"
    ],
    "geometry": [
        "plane-geometry.html",
        "solid-geometry.html",
        "analytic-geometry.html",
        "conic-sections.html"
    ],
    "calculus": [
        "limit.html",
        "derivatives.html",
        "application-derivatives.html",
        "integrals.html",
        "application-integrals.html"
    ],
    "probability": [
        "probability-theory.html",
        "binomial-distribution.html",
        "statistics.html"
    ],
    "vectors": [
        "vector-plane.html",
        "space-vector.html"
    ]
}

# 判断文件和路径是否存在，如果不存在则创建
def create_files_and_folders(base_path, files):
    if not os.path.exists(base_path):
        os.makedirs(base_path)
        print(f"Created directory: {base_path}")
    
    for file in files:
        html_path = os.path.join(base_path, file)
        md_path = html_path.replace(".html", ".md")

        # 如果html文件不存在，创建空文件
        if not os.path.exists(html_path):
            open(html_path, 'w').close()
            print(f"Created file: {html_path}")

        # 如果md文件不存在，创建空文件
        if not os.path.exists(md_path):
            open(md_path, 'w').close()
            print(f"Created file: {md_path}")

# 遍历文件结构，调用函数创建文件和文件夹
for folder, files in file_structure.items():
    create_files_and_folders(folder, files)
